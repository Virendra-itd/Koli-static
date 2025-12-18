import React, { useEffect, useState } from 'react';
import { ArrowRight, Waves } from 'lucide-react';
import { Button } from './ui/button';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
      <div
        className="absolute inset-0 z-0 hero-background"
        style={
          {
            backgroundImage: 'url(/images/hero/banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll'
          }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/80 via-[#003366]/70 to-[#003366]/90"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-150 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Tradition Meets <span className="text-[#FF6600]">Taste</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Delivering the freshest catch from shore to your door
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection('varieties')}
              className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              size="lg"
            >
              Explore Varieties
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-white hover:bg-white/90 text-[#003366] px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              size="lg"
            >
              Contact Us
            </Button>
          </div>
        </div>

        <div className={`mt-16 transition-all duration-150 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <div className="inline-flex items-center space-x-2 text-white/80 animate-bounce">
            <Waves size={24} />
            <span className="text-sm">Scroll to discover</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
