# Security Setup Guide

This guide explains how to properly configure the security features for the Mini Arcade application.

## Environment Variables Setup

### 1. Create Environment File
Create a `.env` file in the root of your project (this file is already in `.gitignore`):

```bash
# Copy the example file
cp .env.example .env
```

### 2. Firebase Configuration
Get your Firebase configuration from the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → Project settings
4. Under "Your apps", copy the config object
5. Update your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Stripe Configuration
Set up Stripe for payment processing:

1. Create a [Stripe account](https://stripe.com/)
2. Get your publishable key from Stripe Dashboard → Developers → API keys
3. Create products and prices in Stripe Dashboard
4. Update your `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
VITE_STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
VITE_STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id
```

### 4. AdSense Configuration
Set up Google AdSense:

1. Create an [AdSense account](https://www.google.com/adsense/)
2. Get your publisher ID from AdSense dashboard
3. Update your `.env` file:

```env
VITE_ADSENSE_CLIENT_ID=ca-pub-your_actual_publisher_id
```

## Backend API Setup (Stripe)

### Required Backend Endpoint
The Stripe integration requires a backend API endpoint at `/api/create-checkout-session`. Here's a simple Node.js example:

```javascript
// server.js
const express = require('express');
const Stripe = require('stripe');
const app = express();
const stripe = Stripe('sk_test_your_secret_key_here');

app.use(express.json());
app.use(express.static('dist'));

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Firebase Functions Alternative
If you're using Firebase, you can create a Cloud Function:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_your_secret_key_here');

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    const { priceId } = data;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://your-app.web.app/success',
      cancel_url: 'https://your-app.web.app/cancel',
    });

    return { id: session.id };
  } catch (error) {
    console.error('Stripe session creation error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});
```

## Security Best Practices

### 1. Firebase Security Rules
Configure Firebase security rules to protect your data:

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game scores are readable by all, writable by authenticated users
    match /scores/{scoreId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Environment Security
- Never commit `.env` files to version control
- Use different keys for development and production
- Regularly rotate API keys
- Use environment-specific configurations

### 3. Content Security Policy
The application includes security headers in `firebase.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### 4. Input Validation
All user inputs are validated:
- Number ranges in games
- Form inputs with proper error handling
- API request validation

## Deployment Security

### 1. Production Environment
Create a production `.env` file with production keys:
```env
VITE_FIREBASE_API_KEY=production_firebase_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_production_key
```

### 2. Firebase Hosting Security
- Enable HTTPS (automatic with Firebase Hosting)
- Configure proper CORS settings
- Use Firebase Hosting security headers

### 3. Monitoring
- Monitor Firebase Analytics for unusual activity
- Set up Stripe fraud detection
- Regular security audits

## Testing Security

### 1. Local Development
Test with test keys in development:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_test_key
```

### 2. Security Testing
- Test all input validation
- Verify API endpoints are secure
- Test error handling
- Verify environment variables are not exposed

## Troubleshooting

### Common Issues
1. **Environment variables not loading**: Ensure `.env` file exists and is properly formatted
2. **Stripe errors**: Check that backend API is running and keys are correct
3. **Firebase errors**: Verify Firebase configuration and security rules
4. **AdSense errors**: Ensure publisher ID is correct and domain is verified

### Debug Mode
For debugging, you can temporarily log environment variables (remove in production):
```javascript
console.log('Environment variables loaded:', {
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set'
});
```

## Security Checklist

- [ ] Environment variables configured
- [ ] API keys are test/production appropriate
- [ ] Firebase security rules configured
- [ ] Backend API endpoint implemented
- [ ] HTTPS enabled in production
- [ ] Security headers configured
- [ ] Input validation tested
- [ ] Error handling tested
- [ ] Monitoring set up
- [ ] Regular security reviews scheduled
