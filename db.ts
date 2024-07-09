import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, varchar, timestamp , integer, unique, text} from 'drizzle-orm/pg-core';
import { eq, ilike , and } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';
import { genSaltSync, hashSync } from 'bcrypt-ts';

const postgresUrl = process.env.NEXT_PUBLIC_POSTGRES_URL;

if (!postgresUrl) {
  throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
}

let client = neon(postgresUrl, {
  fetchOptions: {
    cache: 'no-store'
  }
});
// export const db = drizzle(
//   neon(process.env.POSTGRES_URL!, {
//     fetchOptions: {
//       cache: 'no-store'
//     }
//   })
// );

export const db = drizzle(client);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }),
  email: varchar('email', { length: 200 }).unique(),
  password: varchar('password', { length: 200 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  image: text('image'),
  emailVerified: timestamp('email_verified')
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique()
});

export const userSubjectRankings = pgTable('user_subject_rankings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  rank: integer('rank').notNull(),
}, (table) => {
  return {
    userSubjectUnique: unique().on(table.userId, table.subjectId)
  }
});

export type SelectUser = typeof users.$inferSelect;

export async function updateUser(email: string, newEmail: string){
  const User = await db.update(users).set({email:newEmail}).where(eq(users.email, email));
  console.log("User update: ", User);
  return User;
}

export async function createUser(name: string, email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);
  const User = db.insert(users).values({ name, email, password: hash });
  console.log(User);
  return User;
}

export async function getUser(email: string) {
  const User =  await db.select().from(users).where(eq(users.email, email));
  return User;
}


export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      users: await db
        .select()
        .from(users)
        .where(ilike(users.name, `%${search}%`))
        .limit(1000),
      newOffset: null
    };
  }

  if (offset === null) {
    return { users: [], newOffset: null };
  }

  const moreUsers = await db.select().from(users).limit(20).offset(offset);
  const newOffset = moreUsers.length >= 20 ? offset + 20 : null;
  return { users: moreUsers, newOffset };
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}

export async function getSubjectIdByName(name: string) {
  try {
    console.log(name);
    const result = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(eq(subjects.name, name))
      .limit(1);

    return result[0]?.id || null;
  } catch (error) {
    console.error('Error fetching subject ID:', error);
    throw new Error('Failed to fetch subject ID');
  }
}

export async function initializeOrGetRanking(userId: number, subjectId: number) {
  const existingRanking = await db
    .select()
    .from(userSubjectRankings)
    .where(and(
      eq(userSubjectRankings.userId, userId),
      eq(userSubjectRankings.subjectId, subjectId)
    ))
    .limit(1);

  if (existingRanking.length > 0) {
    return existingRanking[0];
  }

  const initialRank = 0; // Or whatever initial value you want
  const newRanking = await db.insert(userSubjectRankings)
    .values({ userId, subjectId, rank: initialRank })
    .returning();

  return newRanking[0];
}

export async function addOrUpdateRanking(userId: number, subjectId: number, rank: number) {
  const existingRanking = await db
    .select()
    .from(userSubjectRankings)
    .where(and(
      eq(userSubjectRankings.userId, userId),
      eq(userSubjectRankings.subjectId, subjectId)
    ))
    .limit(1);

  if (existingRanking.length > 0) {
    return await db.update(userSubjectRankings)
      .set({ rank })
      .where(and(
        eq(userSubjectRankings.userId, userId),
        eq(userSubjectRankings.subjectId, subjectId)
      ))
      .returning();
  } else {
    return await db.insert(userSubjectRankings)
      .values({ userId, subjectId, rank })
      .returning();
  }
}

export async function getUserRankings(userId: number) {
  return await db
    .select({
      subjectName: subjects.name,
      rank: userSubjectRankings.rank
    })
    .from(userSubjectRankings)
    .innerJoin(subjects, eq(subjects.id, userSubjectRankings.subjectId))
    .where(eq(userSubjectRankings.userId, userId));
}

export async function getSubjectRankings(subjectId: number) {
  return await db
    .select({
      userName: users.name,
      rank: userSubjectRankings.rank
    })
    .from(userSubjectRankings)
    .innerJoin(users, eq(users.id, userSubjectRankings.userId))
    .where(eq(userSubjectRankings.subjectId, subjectId))
    .orderBy(userSubjectRankings.rank);
}