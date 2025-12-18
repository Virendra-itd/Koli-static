import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { fishVarieties } from '../mockData';
import { Star, Filter } from 'lucide-react';
import { Button } from './ui/button';
import OptimizedImage from './OptimizedImage';
import { useImagePreloader } from '../hooks/useImagePreloader';

const FishVarietiesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // Fast initial visibility check
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight + 200;
      if (isInViewport) {
        setIsVisible(true);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0, rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const categories = ['All', 'Premium', 'Saltwater'];

  const filteredFish = useMemo(() => {
    return selectedCategory === 'All'
      ? fishVarieties
      : fishVarieties.filter(fish => fish.category === selectedCategory);
  }, [selectedCategory]);

  // Preload all fish images immediately and when section becomes visible
  const fishImageUrls = useMemo(() => fishVarieties.map(fish => fish.image), []);
  useImagePreloader(fishImageUrls, true); // Always preload, don't wait for visibility

  const handleCategoryChange = useCallback((category) => {
    if (category === selectedCategory) return;
    
    setIsChanging(true);
    // Use requestAnimationFrame for instant update
    requestAnimationFrame(() => {
      setSelectedCategory(category);
      requestAnimationFrame(() => {
        setIsChanging(false);
      });
    });
  }, [selectedCategory]);

  const handleMouseEnter = useCallback((id) => {
    setHoveredCard(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  return (
    <section id="varieties" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-150 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">Fresh Varieties</h2>
          <div className="w-24 h-1 bg-[#FF6600] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our wide selection of fresh fish and seafood, sourced daily from the ocean
          </p>
        </div>

        <div className="flex justify-center items-center gap-1 mb-12 flex-wrap bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-full w-fit mx-auto shadow-inner border border-gray-200/50">
          <div className="flex items-center gap-1 px-3">
            <Filter className="text-[#003366]" size={16} />
            <span className="text-xs text-gray-600 font-medium hidden sm:inline">Filter:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ease-out ${
                selectedCategory === category
                  ? 'text-white shadow-md'
                  : 'text-[#003366] hover:text-[#FF6600] hover:bg-white/50'
              }`}
            >
              {selectedCategory === category && (
                <span 
                  className="absolute inset-0 bg-gradient-to-r from-[#FF6600] via-[#FF7533] to-[#FF8533] rounded-full"
                  style={{
                    animation: 'tabSlide 0.2s ease-out'
                  }}
                ></span>
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {category}
                {selectedCategory === category && (
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                )}
              </span>
            </button>
          ))}
        </div>

        <div 
          ref={gridRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity duration-150 ${
            isChanging ? 'opacity-0' : 'opacity-100'
          }`}
          key={selectedCategory}
        >
          {filteredFish.map((fish, index) => (
            <div
              key={fish.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-150 ease-out transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group"
              style={{
                animation: `slideUpFade 0.15s ease-out ${Math.min(index * 0.005, 0.05)}s both`,
                willChange: 'transform, opacity'
              }}
              onMouseEnter={() => handleMouseEnter(fish.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative overflow-hidden h-48 group-hover:brightness-110 transition-all duration-300">
                <OptimizedImage
                  src={fish.image}
                  alt={fish.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                    hoveredCard === fish.id ? 'scale-110' : 'scale-100'
                  }`}
                  eager={index < 4} // Eager load first 4 images
                  sectionVisible={isVisible} // Load all images when section is visible
                  style={{ height: '100%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {fish.isPremium && (
                  <div className="absolute top-3 right-3 bg-[#FF6600] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star size={12} fill="white" />
                    Premium
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-bold text-xl">{fish.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm bg-[#E8F4F8] text-[#003366] px-3 py-1 rounded-full font-medium">
                    {fish.category}
                  </span>
                  <span className="text-[#FF6600] font-bold text-lg">{fish.priceRange}</span>
                </div>
                <p className="text-gray-600 text-sm">{fish.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FishVarietiesSection;
