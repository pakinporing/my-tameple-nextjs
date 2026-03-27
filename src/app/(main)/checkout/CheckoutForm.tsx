'use client';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(
      // Stripe จะดึง clientSecret จาก Elements
      (elements as any)._clientSecret,
      {
        payment_method: {
          card: card!
        }
      }
    );

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      router.push('/success');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>ชำระเงิน</h2>

      <div style={{ margin: '20px 0' }}>
        <CardElement />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </div>
  );
}
