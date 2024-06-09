'use server';

import { deleteUserById } from '@/db';
import { revalidatePath } from 'next/cache';

export async function deleteUser(userId: number) {
  // Uncomment this to enable deletion
  await deleteUserById(userId);
  revalidatePath('/user-table');
}
