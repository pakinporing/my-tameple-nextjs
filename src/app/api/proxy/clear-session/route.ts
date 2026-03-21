import { signOut } from '@/libs/auth/auth';

export async function GET() {
  await signOut();
}
