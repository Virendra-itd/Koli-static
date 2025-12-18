import React, { useEffect, useRef, useState } from 'react';
import { testimonials } from '../mockData';
import { Star, Quote } from 'lucide-react';

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <section id="pricing" ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-[#E8F4F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-150 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Reasonable Rates, Unmatched Quality
          </h2>
          <div className="w-24 h-1 bg-[#FF6600] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Premium quality seafood at prices that make sense for your budget
          </p>
        </div>

        <div className={`bg-white rounded-2xl p-8 md:p-12 shadow-xl mb-16 transition-all duration-150 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-[#FF6600] mb-2">₹150+</div>
              <div className="text-gray-600">Starting Price/kg</div>
              <div className="text-sm text-gray-500 mt-2">Fresh daily catch</div>
            </div>
            <div className="p-6 border-l-0 md:border-l border-t md:border-t-0 border-gray-200">
              <div className="text-5xl font-bold text-[#FF6600] mb-2">100%</div>
              <div className="text-gray-600">Freshness Guarantee</div>
              <div className="text-sm text-gray-500 mt-2">Or money back</div>
            </div>
            <div className="p-6 border-l-0 md:border-l border-t md:border-t-0 border-gray-200">
              <div className="text-5xl font-bold text-[#FF6600] mb-2">24/7</div>
              <div className="text-gray-600">Order Support</div>
              <div className="text-sm text-gray-500 mt-2">Always available</div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-150 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h3 className="text-3xl font-bold text-[#003366] mb-8 text-center">What Our Customers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-150 ease-out transform hover:-translate-y-2"
                style={{ 
                  transitionDelay: `${index * 5}ms`,
                  willChange: 'transform, opacity'
                }}
              >
                <Quote className="text-[#FF6600]/30 mb-4" size={40} />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-[#FF6600]" size={16} fill="#FF6600" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-bold text-[#003366]">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
