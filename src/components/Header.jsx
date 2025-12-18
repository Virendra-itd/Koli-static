import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <img
              src="/images/logos/logo.png"
              alt="Koli Catch Logo"
              className="h-12 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.logo-fallback');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="text-2xl font-bold text-[#003366] logo-fallback" style={{display: 'none'}}>
              Koli Catch
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('varieties')}
              className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium"
            >
              Our Fish
            </button>
            <button
              onClick={() => scrollToSection('business')}
              className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium"
            >
              Pricing
            </button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white transition-all duration-300"
            >
              Contact Us
            </Button>
          </nav>

          <button
            className="md:hidden text-[#003366]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('about')}
                className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium text-left"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('varieties')}
                className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium text-left"
              >
                Our Fish
              </button>
              <button
                onClick={() => scrollToSection('business')}
                className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium text-left"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-[#003366] hover:text-[#FF6600] transition-colors duration-300 font-medium text-left"
              >
                Pricing
              </button>
              <Button
                onClick={() => scrollToSection('contact')}
                className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white w-full"
              >
                Contact Us
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
