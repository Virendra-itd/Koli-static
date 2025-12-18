/**
 * Global image preloader - preloads all images on page load
 */

const imageCache = new Set();

export const preloadImage = (url) => {
  if (!url || imageCache.has(url)) return;
  
  imageCache.add(url);
  
  // Create prefetch link
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);

  // Force browser to fetch by creating Image object with onload to ensure fetch
  const img = new Image();
  img.onload = () => {
    // Image loaded successfully
  };
  img.onerror = () => {
    // Image failed to load, but that's okay
  };
  img.src = url;
};

export const preloadImages = (urls) => {
  if (!urls || urls.length === 0) return;
  
  // Batch load images with slight delay between batches to avoid overwhelming
  urls.forEach((url, index) => {
    // Small stagger to avoid blocking, but very fast
    setTimeout(() => {
      preloadImage(url);
    }, index * 5); // 5ms delay between each image
  });
};

// Preload critical images on page load
if (typeof window !== 'undefined') {
  // Wait for page to be interactive
  if (document.readyState === 'complete') {
    // Page already loaded, preload immediately
    setTimeout(() => {
      // Preload will be done by components, but we can add more here if needed
    }, 100);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Preload will be done by components
      }, 100);
    });
  }
}

