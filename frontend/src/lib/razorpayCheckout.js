const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let scriptPromise = null;

function loadRazorpayScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay is only available in the browser'));
  }
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay));
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(payment, { onSuccess, onDismiss }) {
  const Razorpay = await loadRazorpayScript();
  const key =
    payment.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || '';

  if (!key) {
    throw new Error('Razorpay key is not configured (VITE_RAZORPAY_KEY_ID)');
  }

  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount: payment.amount,
      currency: payment.currency || 'INR',
      name: 'Toy Culture',
      description: `Order ${payment.order_number || ''}`.trim(),
      order_id: payment.razorpay_order_id,
      prefill: payment.prefill || {},
      theme: { color: '#F96515' },
      handler(response) {
        onSuccess?.(response);
        resolve(response);
      },
      modal: {
        ondismiss() {
          onDismiss?.();
          reject(new Error('Payment cancelled'));
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response) => {
      reject(new Error(response?.error?.description || 'Payment failed'));
    });
    rzp.open();
  });
}
