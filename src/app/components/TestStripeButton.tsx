'use client';
import { useRouter } from 'next/navigation';
export default function TestStripeButton() {
  const router = useRouter();
  return (
    <div style={{ padding: 40 }}>
      <h1>My Shop</h1>

      <button onClick={() => router.push('/checkout')}>ไปจ่ายเงิน</button>
    </div>
  );
}
