import React, { useEffect, useRef } from 'react';

const AdBanner = ({ adSlot, adFormat = 'auto', className = '' }) => {
  const adRef = useRef(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // Only initialize AdSense once per ad component
    if (adInitialized.current || !adRef.current) {
      return;
    }

    try {
      // Check if AdSense script is loaded
      if (window.adsbygoogle) {
        // Clear any existing ads in this element
        adRef.current.innerHTML = '';
        
        // Create new ad element
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-demo");
        adElement.setAttribute('data-ad-slot', adSlot);
        adElement.setAttribute('data-ad-format', adFormat);
        adElement.setAttribute('data-full-width-responsive', 'true');
        
        // Append to container
        adRef.current.appendChild(adElement);
        
        // Push to AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        adInitialized.current = true;
      } else {
        console.log('📺 AdSense not loaded - showing placeholder');
        // Show placeholder when AdSense is not available
        adRef.current.innerHTML = `
          <div style="border: 2px dashed #ccc; padding: 20px; text-align: center; color: #666;">
            <div>📺 Ad Placeholder</div>
            <small>AdSense not configured</small>
          </div>
        `;
      }
    } catch (err) {
      console.log('📺 AdSense error (expected in local mode):', err.message);
      // Show fallback content
      if (adRef.current) {
        adRef.current.innerHTML = `
          <div style="border: 2px dashed #ccc; padding: 20px; text-align: center; color: #666;">
            <div>📺 Ad Space</div>
            <small>AdSense disabled</small>
          </div>
        `;
      }
    }
  }, [adSlot, adFormat]);

  return (
    <div className={`ad-banner ${className}`}>
      <div ref={adRef} />
    </div>
  );
};

export default AdBanner;
