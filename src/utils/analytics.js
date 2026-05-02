import { analytics } from '../firebase';

// Track page views
export const trackPageView = (pageName) => {
  if (analytics && analytics.logEvent) {
    analytics.logEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href,
    });
  } else {
    console.log(`📊 [Analytics] Page view: ${pageName}`);
  }
};

// Track game plays
export const trackGamePlay = (gameName) => {
  if (analytics && analytics.logEvent) {
    analytics.logEvent('game_play', {
      game_name: gameName,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.log(`📊 [Analytics] Game play: ${gameName}`);
  }
};

// Track ad impressions
export const trackAdImpression = (adType, position) => {
  if (analytics && analytics.logEvent) {
    analytics.logEvent('ad_impression', {
      ad_type: adType,
      ad_position: position,
    });
  } else {
    console.log(`📊 [Analytics] Ad impression: ${adType} at ${position}`);
  }
};

// Track premium feature interactions
export const trackPremiumInteraction = (action, feature = null) => {
  if (analytics && analytics.logEvent) {
    analytics.logEvent('premium_interaction', {
      action: action, // 'view', 'click', 'subscribe_attempt'
      feature: feature, // 'monthly_plan', 'yearly_plan', 'ad_free', etc.
    });
  } else {
    console.log(`📊 [Analytics] Premium interaction: ${action} - ${feature}`);
  }
};

// Track subscription events
export const trackSubscription = (event, plan) => {
  if (analytics && analytics.logEvent) {
    analytics.logEvent('subscription', {
      event: event, // 'started', 'completed', 'failed'
      plan: plan, // 'monthly', 'yearly'
      value: plan === 'monthly' ? 4.99 : 39.99,
      currency: 'USD',
    });
  } else {
    console.log(`📊 [Analytics] Subscription: ${event} - ${plan}`);
  }
};

// Track user engagement
export const trackUserEngagement = (duration, actions) => {
  if (analytics && analytics.logEvent) {
    analytics.logEvent('user_engagement', {
      engagement_time_msec: duration,
      session_actions: actions,
    });
  } else {
    console.log(`📊 [Analytics] User engagement: ${duration}ms, ${actions} actions`);
  }
};

export default analytics;
