import React, { useEffect, useRef, useState } from 'react';
import { Home, Building2, ArrowRight, Package, Truck, CheckCircle } from 'lucide-react';
import { supplyChain } from '../mockData';
import { Button } from './ui/button';
import OptimizedImage from './OptimizedImage';

const BusinessModelSection = () => {
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

  const businessModels = [
    {
      icon: Home,
      type: 'B2C',
      title: 'For Homes',
      description: 'Fresh fish delivered daily to your doorstep',
      features: [
        'Same-day delivery',
        'Cleaned and cut as per preference',
        'Minimum order 1kg',
        'Fresh catch guarantee'
      ],
      image: '/images/business/fish-9.jpeg'
    },
    {
      icon: Building2,
      type: 'B2B',
      title: 'For Businesses',
      description: 'Reliable bulk supply for restaurants, hotels & retailers',
      features: [
        'Bulk pricing available',
        'Daily/weekly contracts',
        'Quality certification',
        'Dedicated account manager'
      ],
      image: '/images/business/fish-10.jpeg'
    }
  ];

  const getStepIcon = (step) => {
    const icons = {
      1: Package,
      2: CheckCircle,
      3: Package,
      4: Truck
    };
    return icons[step] || Package;
  };

  return (
    <section id="business" ref={sectionRef} className="py-20 bg-gradient-to-b from-[#E8F4F8] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-150 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">How We Serve You</h2>
          <div className="w-24 h-1 bg-[#FF6600] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Whether you're a home chef or running a restaurant, we've got you covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {businessModels.map((model, index) => {
            const Icon = model.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-150 ease-out transform hover:-translate-y-2 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 10}ms`,
                  willChange: 'transform, opacity'
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src={model.image}
                    alt={model.title}
                    className="w-full h-full object-cover"
                    eager={true} // Eager load since these are visible cards
                    sectionVisible={isVisible} // Also load when section becomes visible
                    style={{ height: '100%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-[#FF6600] rounded-full flex items-center justify-center">
                        <Icon className="text-white" size={24} />
                      </div>
                      <span className="text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {model.type}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-2xl">{model.title}</h3>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 mb-6">{model.description}</p>
                  <ul className="space-y-3 mb-6">
                    {model.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="text-[#FF6600] mr-3 flex-shrink-0" size={20} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-[#FF6600] hover:bg-[#FF6600]/90 text-white transition-all duration-300">
                    Get Started
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`bg-white rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-150 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h3 className="text-3xl font-bold text-[#003366] mb-8 text-center">Our Supply Chain</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {supplyChain.map((item, index) => {
              const StepIcon = getStepIcon(item.step);
              return (
                <div key={index} className="text-center relative">
                  <div className="w-20 h-20 bg-[#FF6600]/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <StepIcon className="text-[#FF6600]" size={32} />
                  </div>
                  <div className="text-[#003366] font-bold text-xl mb-2">{item.title}</div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  {index < supplyChain.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-10 -right-12 text-[#FF6600]/30" size={24} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModelSection;
