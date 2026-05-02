const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Stripe with your secret key
const stripe = Stripe('sk_test_YOUR_STRIPE_SECRET_KEY_HERE'); // Replace with your actual secret key

// CORS configuration
const cors = require('cors')({ origin: true });

// Create Stripe checkout session
exports.createCheckoutSession = functions.https.onRequest(async function(req, res) {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      // Validate price ID format
      if (!priceId.startsWith('price_')) {
        return res.status(400).json({ error: 'Invalid price ID format' });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
        metadata: {
          source: 'mini_arcade_web'
        }
      });

      res.json({ id: session.id });
    } catch (error) {
      console.error('Stripe session creation error:', error);
      res.status(500).json({ 
        error: 'Failed to create checkout session',
        details: error.message 
      });
    }
  });
});

// Verify Stripe webhook (for payment confirmation)
exports.webhook = functions.https.onRequest(async function(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET_HERE'; // Replace with your webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      
      // You could update user's premium status in Firestore here
      // await admin.firestore().collection('users').doc(session.customer).update({
      //   premium: true,
      //   subscriptionId: session.subscription
      // });
      
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Payment succeeded for invoice:', invoice.id);
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('Payment failed for invoice:', failedInvoice.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true });
});

// Get user subscription status
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  
  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    return {
      premium: userData?.premium || false,
      subscriptionId: userData?.subscriptionId || null,
      cancelAtPeriodEnd: userData?.cancelAtPeriodEnd || false
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get subscription status');
  }
});

// Cancel subscription
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  
  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData?.subscriptionId) {
      throw new functions.https.HttpsError('not-found', 'No active subscription found');
    }

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(userData.subscriptionId, {
      cancel_at_period_end: true
    });

    // Update user document
    await admin.firestore().collection('users').doc(userId).update({
      cancelAtPeriodEnd: true
    });

    return { 
      success: true, 
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end 
    };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to cancel subscription');
  }
});
