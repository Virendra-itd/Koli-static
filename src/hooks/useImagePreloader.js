import { useEffect, useRef } from 'react';

/**
 * Preloads images aggressively - loads immediately and when section becomes visible
 * @param {Array} imageUrls - Array of image URLs to preload
 * @param {boolean} isVisible - Whether the section is visible
 */
export const useImagePreloader = (imageUrls, isVisible) => {
  const preloadedRef = useRef(new Set());

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    // Preload images immediately on mount (deferred slightly to not block initial render)
    const preloadImages = () => {
      imageUrls.forEach((url) => {
        if (!url || preloadedRef.current.has(url)) return;
        
        preloadedRef.current.add(url);
        
        // Create prefetch link
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);

        // Force browser to fetch by creating Image object
        const img = new Image();
        img.src = url;
      });
    };

    // Start preloading immediately (deferred by 50ms to not block initial render)
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(preloadImages, { timeout: 50 });
    } else {
      setTimeout(preloadImages, 50);
    }

    // Also preload when section becomes visible (redundant but ensures loading)
    if (isVisible) {
      preloadImages();
    }
  }, [imageUrls, isVisible]);
};

