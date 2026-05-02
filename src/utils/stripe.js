import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with environment variable
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.reject(new Error('Stripe publishable key not configured'));

export const createCheckoutSession = async (priceId) => {
  try {
    // Validate priceId
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    // Check if backend API is available
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const session = await response.json();
    
    if (!session.id) {
      throw new Error('Invalid session response from server');
    }
    
    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(`Stripe checkout error: ${result.error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Checkout error:', error);
    
    // Return error for UI handling
    return { 
      success: false, 
      error: error.message || 'Failed to create checkout session' 
    };
  }
};

// Get price IDs from environment
export const STRIPE_PRICE_IDS = {
  monthly: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
  yearly: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder'
};

export default stripePromise;
