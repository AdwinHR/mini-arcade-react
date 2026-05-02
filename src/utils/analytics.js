import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

// Track page views
export const trackPageView = (pageName) => {
  logEvent(analytics, 'page_view', {
    page_title: pageName,
    page_location: window.location.href,
  });
};

// Track game plays
export const trackGamePlay = (gameName) => {
  logEvent(analytics, 'game_play', {
    game_name: gameName,
    timestamp: new Date().toISOString(),
  });
};

// Track ad impressions
export const trackAdImpression = (adType, position) => {
  logEvent(analytics, 'ad_impression', {
    ad_type: adType,
    ad_position: position,
  });
};

// Track premium feature interactions
export const trackPremiumInteraction = (action, feature = null) => {
  logEvent(analytics, 'premium_interaction', {
    action: action, // 'view', 'click', 'subscribe_attempt'
    feature: feature, // 'monthly_plan', 'yearly_plan', 'ad_free', etc.
  });
};

// Track subscription events
export const trackSubscription = (event, plan) => {
  logEvent(analytics, 'subscription', {
    event: event, // 'started', 'completed', 'failed'
    plan: plan, // 'monthly', 'yearly'
    value: plan === 'monthly' ? 4.99 : 39.99,
    currency: 'USD',
  });
};

// Track user engagement
export const trackUserEngagement = (duration, actions) => {
  logEvent(analytics, 'user_engagement', {
    engagement_time_msec: duration,
    session_actions: actions,
  });
};

export default analytics;
