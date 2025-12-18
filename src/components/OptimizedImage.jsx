import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  eager = false,
  sectionVisible = false,
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(eager || sectionVisible);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // If eager or section is visible, load immediately
    if (eager || sectionVisible) {
      setShouldLoad(true);
      return;
    }

    // Use Intersection Observer for lazy loading with very early trigger
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            // Disconnect observer once we start loading
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '1000px', // Extremely aggressive - start loading 1000px before entering viewport
        threshold: 0.01
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [eager, sectionVisible]);

  // Force load when section becomes visible
  useEffect(() => {
    if (sectionVisible && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [sectionVisible, shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {shouldLoad && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" style={{ zIndex: 1 }} />
          )}
          <img
            src={src}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              ...style, 
              zIndex: 2, 
              position: 'relative',
              transition: 'opacity 0.1s ease-in'
            }}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={eager ? 'high' : 'auto'}
            onLoad={handleLoad}
            {...props}
          />
        </>
      )}
    </div>
  );
};

export default OptimizedImage;

