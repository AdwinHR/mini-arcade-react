// Simple client-side router for handling game navigation
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    game: params.get('game'),
    challenge: params.get('challenge'),
    mode: params.get('mode')
  };
};

export const navigateTo = (path, params = {}) => {
  const url = new URL(window.location.href);
  
  // Clear existing params
  url.search = '';
  
  // Add new params
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  
  // Update URL without reload
  window.history.pushState({}, '', url);
  
  // Dispatch custom event for components to listen
  window.dispatchEvent(new CustomEvent('routechange', { detail: params }));
};

export const goBack = () => {
  window.history.back();
};

export const clearParams = () => {
  const url = new URL(window.location.href);
  url.search = '';
  window.history.pushState({}, '', url);
  window.dispatchEvent(new CustomEvent('routechange', { detail: {} }));
};

// Game routes
export const ROUTES = {
  HOME: '/',
  GUESS_GAME: '/?game=guess',
  RPS_GAME: '/?game=rps',
  MEMORY_GAME: '/?game=memory',
  MEMORY_CHALLENGE: '/?game=memory&mode=challenge'
};