'use server';

import { auth, signOut } from '@/libs/auth/auth';

export async function getMeAction() {
  const session = await auth();
  if (!session?.accessToken || session.refreshError) {
    await signOut({ redirectTo: '/login' });
    throw new Error('Unauthorized');
  }

  const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.accessToken}`
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      await signOut({ redirectTo: '/login' });
      throw new Error('Unauthorized');
    }
    throw new Error('Request failed');
  }

  const data = await res.json();

  return {
    message: 'เรียกผ่าน Server Action สำเร็จ',
    data
  };
}
