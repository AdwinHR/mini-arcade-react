import { loadStripe } from '@stripe/stripe-js';

// Check if Stripe is configured
const isStripeConfigured = () => {
  return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && 
         import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY !== 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE' &&
         import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY !== '';
};

// Load Stripe with environment variable
const stripePromise = isStripeConfigured() 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null); // Return null instead of rejecting

export const createCheckoutSession = async (priceId) => {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      console.log('💳 Stripe not configured - showing demo mode');
      return { 
        success: false, 
        error: 'Stripe not configured. This is a demo mode. To enable payments, configure VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.' 
      };
    }

    // Validate priceId
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
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
