import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { contactInfo } from '../mockData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from './ui/sonner';
import axios from 'axios';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderType: '',
    message: '',
    website: '' // Honeypot field for spam protection
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
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

  // Sanitize input to prevent XSS attacks
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  // Check for spam patterns (less aggressive to avoid false positives)
  const detectSpam = (text) => {
    const spamPatterns = [
      /(click here|buy now|limited time|act now|urgent|viagra|casino|lottery)/gi, // Common spam phrases
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}){3,}/g, // 3+ emails (likely spam)
      /(http|https|www\.){3,}/gi, // Multiple URLs (likely spam)
    ];
    
    return spamPatterns.some(pattern => pattern.test(text));
  };

  const validateForm = () => {
    const newErrors = {};

    // Honeypot check - if filled, it's a bot
    if (formData.website && formData.website.trim() !== '') {
      newErrors.spam = 'Spam detected';
      setErrors(newErrors);
      return { isValid: false, errors: newErrors };
    }

    // Rate limiting - prevent too many submissions
    const now = Date.now();
    if (lastSubmitTime > 0 && (now - lastSubmitTime) < 60000) { // 1 minute cooldown
      if (submitCount >= 3) {
        newErrors.rateLimit = 'Too many submissions. Please wait a moment.';
        setErrors(newErrors);
        return { isValid: false, errors: newErrors };
      }
    }

    // Name validation - only letters and spaces allowed (no numbers)
    const sanitizedName = sanitizeInput(formData.name);
    if (!sanitizedName) {
      newErrors.name = 'Name is required';
    } else if (sanitizedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (sanitizedName.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(sanitizedName)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Email validation
    const sanitizedEmail = sanitizeInput(formData.email);
    if (!sanitizedEmail) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Order Type validation
    if (!formData.orderType) {
      newErrors.orderType = 'Please select an order type';
    }

    // Message validation with spam detection
    const sanitizedMessage = sanitizeInput(formData.message);
    if (!sanitizedMessage) {
      newErrors.message = 'Message is required';
    } else if (sanitizedMessage.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (sanitizedMessage.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    } else if (detectSpam(sanitizedMessage)) {
      newErrors.message = 'Message contains suspicious content. Please revise.';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Show first error as toast
      const errorMessages = [
        validation.errors.name,
        validation.errors.email,
        validation.errors.orderType,
        validation.errors.message
      ].filter(Boolean);
      
      if (errorMessages.length > 0) {
        const errorMsg = errorMessages[0];
        if (errorMsg === 'Spam detected' || errorMsg.includes('rate limit') || errorMsg.includes('Too many')) {
          toast.error("Security Alert", {
            description: errorMsg,
          });
        } else {
          toast.error(errorMsg, {
            description: "Please fix the error and try again.",
          });
        }
      }
      return;
    }

    setIsSubmitting(true);

    // Update rate limiting
    const now = Date.now();
    if (now - lastSubmitTime > 60000) {
      setSubmitCount(1);
    } else {
      setSubmitCount(prev => prev + 1);
    }
    setLastSubmitTime(now);

    try {
      // Prepare email data with sanitized inputs
      const orderTypeLabel = formData.orderType === 'home' 
        ? 'Home Delivery (B2C)' 
        : formData.orderType === 'bulk' 
        ? 'Bulk Order (B2B)' 
        : 'General Inquiry';

      const sanitizedName = sanitizeInput(formData.name);
      const sanitizedEmail = sanitizeInput(formData.email);
      const sanitizedMessage = sanitizeInput(formData.message);

      const emailData = {
        to: 'info@kolicatch.io',
        subject: `Contact Form: ${orderTypeLabel}`,
        name: sanitizedName,
        email: sanitizedEmail,
        orderType: orderTypeLabel,
        message: sanitizedMessage,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Order Type:</strong> ${orderTypeLabel}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        `
      };

      // Try to send via backend API if available
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      let emailSent = false;
      let lastError = null;

      if (BACKEND_URL) {
        try {
          const response = await axios.post(`${BACKEND_URL}/api/contact`, emailData, {
            timeout: 10000, // 10 second timeout
          });
          if (response.status === 200 || response.status === 201) {
            emailSent = true;
          }
        } catch (apiError) {
          console.log('Backend API error:', apiError.message);
          lastError = apiError;
          // If API fails, try email service as fallback
        }
      }

      // Use email service if backend is not available or failed
      if (!emailSent) {
        try {
          await sendEmailViaService(emailData);
          emailSent = true;
        } catch (serviceError) {
          console.error('Email service error:', serviceError);
          lastError = serviceError;
          throw serviceError; // Re-throw to be caught by outer catch
        }
      }

      if (emailSent) {
        toast.success("Form Submitted Successfully!", {
          description: "Your message has been sent to info@kolicatch.io. We'll get back to you soon!",
        });
        
        // Reset form
        setFormData({ name: '', email: '', orderType: '', message: '', website: '' });
        setErrors({});
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show specific error message based on error type
      let errorMessage = "There was an error submitting your form. Please try again or contact us directly.";
      
      if (error.message) {
        if (error.message.includes('Email service not configured')) {
          errorMessage = "Email service needs to be configured. Please check the browser console for setup instructions, or contact us via WhatsApp.";
        } else if (error.message.includes('HTTP error') || error.message.includes('Network')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('Failed to send') || error.message.includes('Failed')) {
          errorMessage = "Failed to send email. Please try again in a moment or contact us via WhatsApp.";
        } else if (error.message.includes('rate limit') || error.message.includes('Too many')) {
          errorMessage = "Too many requests. Please wait a moment before trying again.";
        } else {
          errorMessage = error.message.length > 100 ? error.message.substring(0, 100) + '...' : error.message;
        }
      }
      
      // Log full error details for debugging
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast.error("Submission Error", {
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  // Send email via secure service (EmailJS or Web3Forms)
  const sendEmailViaService = async (emailData) => {
    try {
      // Option 1: Try EmailJS if configured (no verification needed, secure)
      const emailjsServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const emailjsPublicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        const emailjs = await import('@emailjs/browser');
        
        const templateParams = {
          to_email: emailData.to,
          subject: emailData.subject,
          from_name: emailData.name,
          from_email: emailData.email,
          order_type: emailData.orderType,
          message: emailData.message,
        };

        await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          templateParams,
          emailjsPublicKey
        );
        
        return { success: true };
      }

      // Option 2: Use Web3Forms if key is configured (no verification needed)
      const web3formsKey = process.env.REACT_APP_WEB3FORMS_KEY || '2921dde2-ddc9-4557-be2c-9aae063c492f';
      
      if (web3formsKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: emailData.subject,
            from_name: emailData.name,
            from_email: emailData.email,
            to_email: emailData.to,
            message: `Order Type: ${emailData.orderType}\n\nMessage:\n${emailData.message}`,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to send email');
        }
        return result;
      }

      // If no service is configured, provide clear error with setup instructions
      const errorMsg = 'Email service not configured. Please set up EmailJS or Web3Forms to enable email sending.';
      console.error(errorMsg);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('EMAIL SERVICE SETUP REQUIRED');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
      console.log('Option 1: EmailJS (Recommended - No verification needed)');
      console.log('  1. Go to: https://www.emailjs.com/');
      console.log('  2. Create free account');
      console.log('  3. Add Email Service (Gmail/Outlook/etc.)');
      console.log('  4. Create Email Template with variables:');
      console.log('     - {{to_email}}');
      console.log('     - {{subject}}');
      console.log('     - {{from_name}}');
      console.log('     - {{from_email}}');
      console.log('     - {{order_type}}');
      console.log('     - {{message}}');
      console.log('  5. Add to .env file:');
      console.log('     REACT_APP_EMAILJS_SERVICE_ID=your_service_id');
      console.log('     REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id');
      console.log('     REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key');
      console.log('');
      console.log('Option 2: Web3Forms (Alternative - No verification needed)');
      console.log('  1. Go to: https://web3forms.com/');
      console.log('  2. Get free access key');
      console.log('  3. Add to .env file:');
      console.log('     REACT_APP_WEB3FORMS_KEY=your_access_key');
      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      throw new Error('Email service not configured. Check console for setup instructions.');
      
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-150 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">Get in Touch</h2>
          <div className="w-24 h-1 bg-[#FF6600] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Ready to order? Have questions? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`transition-all duration-150 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
          }`} style={{ willChange: 'transform, opacity' }}>
            <div className="bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl p-8 text-white h-full">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-[#FF6600] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Phone</div>
                      <a href={`tel:${contactInfo.phone}`} className="text-white/80 hover:text-white transition-colors duration-300">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-[#FF6600] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <a href={`mailto:${contactInfo.email}`} className="text-white/80 hover:text-white transition-colors duration-300">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF6600] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Address</div>
                    <p className="text-white/80">{contactInfo.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Order via WhatsApp
                </Button>
              </div>

              <div className="mt-8">
                <div className="rounded-xl w-full h-48 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
                  <img
                    src="/images/logos/logo.png"
                    alt="Koli Catch Logo"
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.logo-fallback');
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div className="text-4xl font-bold text-white logo-fallback" style={{display: 'none'}}>
                    Koli Catch
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-150 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
          }`} style={{ willChange: 'transform, opacity' }}>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl" noValidate>
              {/* Honeypot field - hidden from users, bots will fill it */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                <label htmlFor="website">Website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    placeholder="Enter your name"
                    className={`w-full ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="text"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    placeholder="your.email@example.com"
                    className={`w-full ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.orderType}
                    onValueChange={(value) => {
                      setFormData({ ...formData, orderType: value });
                      if (errors.orderType) {
                        setErrors({ ...errors, orderType: '' });
                      }
                    }}
                  >
                    <SelectTrigger className={`w-full ${errors.orderType ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Delivery (B2C)</SelectItem>
                      <SelectItem value="bulk">Bulk Order (B2B)</SelectItem>
                      <SelectItem value="inquiry">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.orderType && (
                    <p className="mt-1 text-sm text-red-500">{errors.orderType}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) {
                        setErrors({ ...errors, message: '' });
                      }
                    }}
                    placeholder="Tell us about your requirements..."
                    rows={5}
                    className={`w-full ${errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FF6600] hover:bg-[#FF6600]/90 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className={`mt-16 transition-all duration-150 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`} style={{ willChange: 'transform, opacity' }}>
          <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.2088383585545!2d72.8366311!3d18.9147308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c06fffffff%3A0xc0290485a4d73f57!2sSassoon%20Docks!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Koli Catch Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
