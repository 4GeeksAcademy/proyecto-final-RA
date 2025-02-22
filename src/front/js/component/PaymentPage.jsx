import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QtEMiQNYLldjxZ0SbmRssFk7gE23yxCyrbccwZyeeU9EJ1ZFy9Kpj7PeatNHYMcM885qoebIkVAncOCJWZ2DEo5000rVRs3KS');

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentComponent />
    </Elements>
  );
};

export default PaymentPage;
