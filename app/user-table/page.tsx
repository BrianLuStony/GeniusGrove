import { getUsers } from '@/db';
import { UsersTable } from '@/components/user-table/users-table';
import { Search } from '@/components/user-table/search';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const session = await auth()
  console.log(session)
  if(!session){
    return redirect("/");
  }
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { users, newOffset } = await getUsers(search, Number(offset));

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
      </div>
      <div className="w-full mb-4">
        <Search value={searchParams.q} />
      </div>
      <UsersTable users={users} offset={newOffset} />
    </main>
  );
}
