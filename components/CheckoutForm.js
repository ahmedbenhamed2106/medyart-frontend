import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutFormContent({ photo, resolution, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    try {
      // 1. Request Payment Intent from Render Backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-payment-intent/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_id: photo.id, resolution: resolution })
      });

      const data = await res.json();

      if (data.error) {
        setMessage(`Server error: ${data.error}`);
        setLoading(false);
        return;
      }

      // 2. Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setMessage(' Payment Successful! Preparing high-res download...');
        setTimeout(() => onClose(), 2500);
      }
    } catch (err) {
      setMessage('Failed to connect to payment server.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#ffffff',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>

      {message && <p className="text-xs text-center font-medium text-indigo-400">{message}</p>}

      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent {...props} />
    </Elements>
  );
}
