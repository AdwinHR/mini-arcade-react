import React, { useState, useEffect } from 'react';
import { createCheckoutSession, STRIPE_PRICE_IDS } from '../utils/stripe';
import { trackPremiumInteraction, trackSubscription, trackAdImpression } from '../utils/analytics';

const PremiumFeatures = () => {
  const [showPremium, setShowPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    trackPremiumInteraction('subscribe_attempt', `${plan}_plan`);
    trackSubscription('started', plan);
    
    try {
      const result = await createCheckoutSession(STRIPE_PRICE_IDS[plan]);
      
      if (result.success) {
        trackSubscription('completed', plan);
      } else {
        console.error('Subscription error:', result.error);
        trackSubscription('failed', plan);
        // Show error message to user
        alert(`Subscription failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      trackSubscription('failed', plan);
      alert(`Subscription failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showPremium) {
      trackPremiumInteraction('view');
    }
  }, [showPremium]);

  const features = [
    { icon: '🎯', title: 'Ad-Free Experience', desc: 'Enjoy games without any interruptions' },
    { icon: '🏆', title: 'Exclusive Games', desc: 'Unlock premium games and content' },
    { icon: '📊', title: 'Advanced Stats', desc: 'Detailed analytics and progress tracking' },
    { icon: '🎨', title: 'Custom Themes', desc: 'Personalize your gaming experience' },
    { icon: '💾', title: 'Cloud Save', desc: 'Sync progress across all devices' },
    { icon: '⚡', title: 'Priority Support', desc: 'Get help when you need it most' }
  ];

  return (
    <div className="premium-section">
      <div className="premium-banner" onClick={() => setShowPremium(!showPremium)}>
        <div className="premium-content">
          <span className="premium-badge">PRO</span>
          <div>
            <h3>Unlock Premium Features</h3>
            <p>Remove ads & get exclusive content</p>
          </div>
          <button className="premium-btn">
            {showPremium ? '✕' : '→'}
          </button>
        </div>
      </div>
      
      {showPremium && (
        <div className="premium-modal">
          <div className="premium-grid">
            {features.map((feature, index) => (
              <div key={index} className="premium-feature">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="premium-pricing">
            <div className="price-card">
              <h4>Monthly</h4>
              <div className="price">$4.99<span>/month</span></div>
              <button 
                className="btn btn-primary" 
                onClick={() => handleSubscribe('monthly')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Start Free Trial'}
              </button>
            </div>
            <div className="price-card featured">
              <div className="best-value">BEST VALUE</div>
              <h4>Yearly</h4>
              <div className="price">$39.99<span>/year</span></div>
              <div className="savings">Save 33%</div>
              <button 
                className="btn btn-primary" 
                onClick={() => handleSubscribe('yearly')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Start Free Trial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumFeatures;
