'use server';

import { authWithRefresh, signOut } from '@/libs/auth/auth';

export async function getMeAction() {
  const session = await authWithRefresh();
  if (!session?.accessToken || session.refreshError) {
    console.log('First 401 !!!!!!!!!!');
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
      console.log('เข้า 401 !!!!!!!!!!');
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
