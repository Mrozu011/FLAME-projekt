'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContactPage() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Validate form data before submission
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage(t('language') === 'pl' ? 'Proszę wypełnić wszystkie wymagane pola.' : 'Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Validate message length
    if (formData.message.length > 500) {
      setSubmitStatus('error');
      setSubmitMessage(t('language') === 'pl' ? 'Wiadomość nie może przekraczać 500 znaków.' : 'Message cannot exceed 500 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare form data for submission using application/x-www-form-urlencoded format
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('subject', formData.subject);
      formDataToSubmit.append('message', formData.message);

      // Submit to the specified URL
      const response = await fetch('https://readdy.ai/api/form/d24787mb5t8jehpp9vsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(t('language') === 'pl' ? 'Wiadomość została wysłana pomyślnie!' : 'Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(t('language') === 'pl' ? 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.' : 'An error occurred while sending the message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('contactUs')}</h1>
          <p className="text-xl text-gray-600">{t('contactSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sendMessage')}</h2>
            
            {/* Submit Status Messages */}
            {submitStatus !== 'idle' && (
              <div className={`mb-6 p-4 rounded-lg ${submitStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center space-x-2">
                  <i className={`${submitStatus === 'success' ? 'ri-check-circle-fill text-green-600' : 'ri-error-warning-fill text-red-600'}`}></i>
                  <span className={`font-medium ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {submitMessage}
                  </span>
                </div>
                {submitStatus === 'success' && (
                  <p className="text-green-700 text-sm mt-1">
                    {t('language') === 'pl' ? 'Odpowiemy na Twoją wiadomość w ciągu 24 godzin.' : 'We will respond to your message within 24 hours.'}
                  </p>
                )}
              </div>
            )}

            <form 
              id="contact-form"
              data-readdy-form
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('language') === 'pl' ? 'Twoje imię i nazwisko' : 'Your full name'}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('emailAddress')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('language') === 'pl' ? 'twoj@email.com' : 'your@email.com'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('language') === 'pl' ? 'Temat' : 'Subject'} *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-8"
                >
                  <option value="">{t('language') === 'pl' ? 'Wybierz temat' : 'Select a subject'}</option>
                  <option value="order-inquiry">{t('language') === 'pl' ? 'Zapytanie o zamówienie' : 'Order Inquiry'}</option>
                  <option value="product-question">{t('language') === 'pl' ? 'Pytanie o produkt' : 'Product Question'}</option>
                  <option value="return-exchange">{t('language') === 'pl' ? 'Zwrot/Wymiana' : 'Return/Exchange'}</option>
                  <option value="shipping-info">{t('language') === 'pl' ? 'Informacje o dostawie' : 'Shipping Information'}</option>
                  <option value="technical-support">{t('language') === 'pl' ? 'Wsparcie techniczne' : 'Technical Support'}</option>
                  <option value="feedback">{t('language') === 'pl' ? 'Opinia' : 'Feedback'}</option>
                  <option value="other">{t('language') === 'pl' ? 'Inne' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('language') === 'pl' ? 'Wiadomość' : 'Message'} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder={t('language') === 'pl' ? 'Jak możemy Ci pomóc?' : 'How can we help you?'}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.message.length}/500 {t('language') === 'pl' ? 'znaków' : 'characters'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || formData.message.length > 500}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors whitespace-nowrap ${isSubmitting || formData.message.length > 500 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    {t('language') === 'pl' ? 'Wysyłanie...' : 'Sending...'}
                  </span>
                ) : (
                  t('language') === 'pl' ? 'Wyślij wiadomość' : 'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('getInTouch')}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-map-pin-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('visitStore')}</h3>
                  <p className="text-gray-600">
                    123 Fashion Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-phone-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('callUs')}</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('language') === 'pl' ? 'Pon-Pt 9:00-19:00 CET' : 'Mon-Fri 9AM-7PM EST'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-mail-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('emailUs')}</h3>
                  <p className="text-gray-600">support@flame-fashion.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('language') === 'pl' ? 'Odpowiadamy w ciągu 24 godzin' : 'We\'ll respond within 24 hours'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-chat-1-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('liveChat')}</h3>
                  <p className="text-gray-600">
                    {t('language') === 'pl' ? 'Dostępny 24/7' : 'Available 24/7'}
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm mt-1">
                    {t('language') === 'pl' ? 'Rozpocznij czat →' : 'Start chat now →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('storeHours')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t('language') === 'pl' ? 'Poniedziałek - Piątek' : 'Monday - Friday'}
                  </span>
                  <span className="text-gray-900">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t('language') === 'pl' ? 'Sobota' : 'Saturday'}
                  </span>
                  <span className="text-gray-900">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t('language') === 'pl' ? 'Niedziela' : 'Sunday'}
                  </span>
                  <span className="text-gray-900">12:00 PM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('followUs')}</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <i className="ri-facebook-fill text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <i className="ri-instagram-fill text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <i className="ri-twitter-fill text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <i className="ri-pinterest-fill text-white"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('findUs')}</h2>
          <div className="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.99492668459375!3d40.74844597932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629825169716!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
