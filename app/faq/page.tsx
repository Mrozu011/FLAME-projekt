'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

interface FAQItem {
  id: number;
  questionKey: string;
  answerKey: string;
  category: string;
}

export default function FAQPage() {
  const { t } = useTranslation();
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const faqData: FAQItem[] = [
    {
      id: 1,
      questionKey: 'faq.howToOrder',
      answerKey: 'faq.howToOrderAnswer',
      category: 'ordering'
    },
    {
      id: 2,
      questionKey: 'faq.paymentMethods',
      answerKey: 'faq.paymentMethodsAnswer',
      category: 'payment'
    },
    {
      id: 3,
      questionKey: 'faq.shippingTime',
      answerKey: 'faq.shippingTimeAnswer',
      category: 'shipping'
    },
    {
      id: 4,
      questionKey: 'faq.returnPolicy',
      answerKey: 'faq.returnPolicyAnswer',
      category: 'returns'
    },
    {
      id: 5,
      questionKey: 'faq.trackOrder',
      answerKey: 'faq.trackOrderAnswer',
      category: 'shipping'
    },
    {
      id: 6,
      questionKey: 'faq.internationalShipping',
      answerKey: 'faq.internationalShippingAnswer',
      category: 'shipping'
    },
    {
      id: 7,
      questionKey: 'faq.findSize',
      answerKey: 'faq.findSizeAnswer',
      category: 'sizing'
    },
    {
      id: 8,
      questionKey: 'faq.cancelOrder',
      answerKey: 'faq.cancelOrderAnswer',
      category: 'ordering'
    },
    {
      id: 9,
      questionKey: 'faq.giftCards',
      answerKey: 'faq.giftCardsAnswer',
      category: 'payment'
    },
    {
      id: 10,
      questionKey: 'faq.createAccount',
      answerKey: 'faq.createAccountAnswer',
      category: 'account'
    },
    {
      id: 11,
      questionKey: 'faq.damagedItem',
      answerKey: 'faq.damagedItemAnswer',
      category: 'returns'
    },
    {
      id: 12,
      questionKey: 'faq.loyaltyProgram',
      answerKey: 'faq.loyaltyProgramAnswer',
      category: 'account'
    },
    {
      id: 13,
      questionKey: 'faq.discountCode',
      answerKey: 'faq.discountCodeAnswer',
      category: 'payment'
    },
    {
      id: 14,
      questionKey: 'faq.materials',
      answerKey: 'faq.materialsAnswer',
      category: 'products'
    },
    {
      id: 15,
      questionKey: 'faq.sizeExchange',
      answerKey: 'faq.sizeExchangeAnswer',
      category: 'sizing'
    }
  ];

  const categories = [
    { id: 'all', name: t('allQuestions'), count: faqData.length },
    { id: 'ordering', name: t('ordering'), count: faqData.filter(item => item.category === 'ordering').length },
    { id: 'payment', name: t('payment'), count: faqData.filter(item => item.category === 'payment').length },
    { id: 'shipping', name: t('language') === 'pl' ? 'Dostawa' : 'Shipping', count: faqData.filter(item => item.category === 'shipping').length },
    { id: 'returns', name: t('returns'), count: faqData.filter(item => item.category === 'returns').length },
    { id: 'sizing', name: t('sizing'), count: faqData.filter(item => item.category === 'sizing').length },
    { id: 'account', name: t('language') === 'pl' ? 'Konto' : 'Account', count: faqData.filter(item => item.category === 'account').length },
    { id: 'products', name: t('products'), count: faqData.filter(item => item.category === 'products').length }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  const getTranslatedText = (key: string) => {
    const faqTranslations = {
      'faq.howToOrder': t('language') === 'pl' ? 'Jak złożyć zamówienie?' : 'How do I place an order?',
      'faq.howToOrderAnswer': t('language') === 'pl' ? 'Możesz złożyć zamówienie przeglądając nasze produkty, wybierając pożądane przedmioty, dodając je do koszyka i przechodząc do kasy. Będziesz musiał podać informacje o dostawie i dane płatności, aby zakończyć zamówienie.' : 'You can place an order by browsing our products, selecting your desired items, adding them to your cart, and proceeding to checkout. You\'ll need to provide shipping information and payment details to complete your order.',
      'faq.paymentMethods': t('language') === 'pl' ? 'Jakie metody płatności akceptujecie?' : 'What payment methods do you accept?',
      'faq.paymentMethodsAnswer': t('language') === 'pl' ? 'Akceptujemy wszystkie główne karty kredytowe (Visa, Mastercard, American Express), PayPal, Apple Pay i Google Pay. Wszystkie płatności są przetwarzane bezpiecznie przez nasz zaszyfrowany system płatności.' : 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through our encrypted checkout system.',
      'faq.shippingTime': t('language') === 'pl' ? 'Ile czasu trwa dostawa?' : 'How long does shipping take?',
      'faq.shippingTimeAnswer': t('language') === 'pl' ? 'Dostawa standardowa trwa 5-7 dni roboczych, dostawa ekspresowa 2-3 dni roboczych, a dostawa następnego dnia jest dostępna dla zamówień złożonych przed 14:00. Dostawa międzynarodowa zwykle trwa 7-14 dni roboczych.' : 'Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and next-day delivery is available for orders placed before 2 PM. International shipping typically takes 7-14 business days.',
      'faq.returnPolicy': t('language') === 'pl' ? 'Jaka jest wasza polityka zwrotów?' : 'What is your return policy?',
      'faq.returnPolicyAnswer': t('language') === 'pl' ? 'Oferujemy 30-dniową politykę zwrotów dla wszystkich produktów w oryginalnym stanie z metkami. Przedmioty można zwrócić za pełny zwrot lub wymienić na inny rozmiar/kolor. Dostawa zwrotna jest darmowa przy wymianach.' : 'We offer a 30-day return policy for all items in original condition with tags attached. Items can be returned for a full refund or exchanged for a different size/color. Return shipping is free for exchanges.',
      'faq.trackOrder': t('language') === 'pl' ? 'Jak mogę śledzić moje zamówienie?' : 'How do I track my order?',
      'faq.trackOrderAnswer': t('language') === 'pl' ? 'Po wysłaniu zamówienia otrzymasz email z potwierdzeniem z informacjami o śledzeniu. Możesz również śledzić swoje zamówienie logując się na swoje konto i przeglądając historię zamówień.' : 'Once your order ships, you\'ll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.',
      'faq.internationalShipping': t('language') === 'pl' ? 'Czy oferujecie dostawę międzynarodową?' : 'Do you offer international shipping?',
      'faq.internationalShippingAnswer': t('language') === 'pl' ? 'Tak, wysyłamy do ponad 50 krajów na całym świecie. Koszty dostawy i czasy różnią się w zależności od lokalizacji i są obliczane przy kasie. Pamiętaj, że zamówienia międzynarodowe mogą podlegać cłom i podatkom.' : 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location and are calculated at checkout. Please note that international orders may be subject to customs duties and taxes.',
      'faq.findSize': t('language') === 'pl' ? 'Jak znaleźć mój rozmiar?' : 'How do I find my size?',
      'faq.findSizeAnswer': t('language') === 'pl' ? 'Każda strona produktu zawiera szczegółową tabelę rozmiarów. Możesz również użyć naszego wirtualnego przewodnika po rozmiarach lub skontaktować się z obsługą klienta w celu uzyskania spersonalizowanej pomocy dotyczącej rozmiarów. Oferujemy darmowe wymiany, jeśli rozmiar nie pasuje idealnie.' : 'Each product page includes a detailed size chart. You can also use our virtual size guide tool or contact customer service for personalized sizing assistance. We offer free exchanges if the size doesn\'t fit perfectly.',
      'faq.cancelOrder': t('language') === 'pl' ? 'Czy mogę anulować lub zmodyfikować moje zamówienie?' : 'Can I cancel or modify my order?',
      'faq.cancelOrderAnswer': t('language') === 'pl' ? 'Zamówienia można anulować lub zmodyfikować w ciągu 1 godziny od złożenia. Po tym czasie zamówienia wchodzą w proces realizacji i nie można ich zmienić. Jeśli musisz wprowadzić zmiany, skontaktuj się z obsługą klienta tak szybko, jak to możliwe.' : 'Orders can be cancelled or modified within 1 hour of placement. After that, orders enter processing and cannot be changed. If you need to make changes, please contact customer service as soon as possible.',
      'faq.giftCards': t('language') === 'pl' ? 'Czy oferujecie karty podarunkowe?' : 'Do you offer gift cards?',
      'faq.giftCardsAnswer': t('language') === 'pl' ? 'Tak, oferujemy cyfrowe karty podarunkowe o nominałach 25, 50, 100 i 200 dolarów. Karty podarunkowe są dostarczane przez email i mogą być używane do każdego zakupu na naszej stronie. Nie wygasają i mogą być łączone z innymi promocjami.' : 'Yes, we offer digital gift cards in denominations of $25, $50, $100, and $200. Gift cards are delivered via email and can be used for any purchase on our website. They don\'t expire and can be combined with other promotions.',
      'faq.createAccount': t('language') === 'pl' ? 'Jak utworzyć konto?' : 'How do I create an account?',
      'faq.createAccountAnswer': t('language') === 'pl' ? 'Kliknij przycisk "Zarejestruj się" na górze dowolnej strony i wypełnij formularz rejestracyjny swoim emailem i hasłem. Utworzenie konta pozwala na śledzenie zamówień, zapisywanie ulubionych i szybsze kończenie zakupów.' : 'Click the \'Sign Up\' button at the top of any page and fill out the registration form with your email and password. Creating an account allows you to track orders, save favorites, and enjoy faster checkout.',
      'faq.damagedItem': t('language') === 'pl' ? 'Co zrobić, jeśli otrzymam uszkodzony przedmiot?' : 'What if I receive a damaged item?',
      'faq.damagedItemAnswer': t('language') === 'pl' ? 'Jeśli otrzymasz uszkodzony przedmiot, skontaktuj się z nami w ciągu 48 godzin ze zdjęciami uszkodzeń. Zapewnimy opłaconą etykietę zwrotną i przyspieszymy wymianę bez żadnych kosztów dla Ciebie.' : 'If you receive a damaged item, please contact us within 48 hours with photos of the damage. We\'ll provide a prepaid return label and expedite a replacement at no cost to you.',
      'faq.loyaltyProgram': t('language') === 'pl' ? 'Czy macie program lojalnościowy?' : 'Do you have a loyalty program?',
      'faq.loyaltyProgramAnswer': t('language') === 'pl' ? 'Tak, nasz program Flame Rewards oferuje punkty za każdy zakup, ekskluzywne zniżki, wczesny dostęp do wyprzedaży i specjalne oferty urodzinowe. Automatycznie zarabiasz punkty z każdym zakupem i możesz wymieniać je na zniżki.' : 'Yes, our Flame Rewards program offers points for every purchase, exclusive discounts, early access to sales, and special birthday offers. You\'ll automatically earn points with each purchase and can redeem them for discounts.',
      'faq.discountCode': t('language') === 'pl' ? 'Jak użyć kodu rabatowego?' : 'How do I use a discount code?',
      'faq.discountCodeAnswer': t('language') === 'pl' ? 'Wpisz swój kod rabatowy w polu "Kod promocyjny" podczas kasy przed zakończeniem płatności. Rabat zostanie zastosowany do sumy zamówienia. Tylko jeden kod rabatowy może być użyty na zamówienie.' : 'Enter your discount code in the \'Promo Code\' field during checkout before completing your payment. The discount will be applied to your order total. Only one discount code can be used per order.',
      'faq.materials': t('language') === 'pl' ? 'Z jakich materiałów są wykonane wasze ubrania?' : 'What materials are your clothes made from?',
      'faq.materialsAnswer': t('language') === 'pl' ? 'Używamy różnych wysokiej jakości materiałów, w tym bawełny, wełny, jedwabiu i zrównoważonych mieszanek syntetycznych. Każda strona produktu zawiera szczegółowe informacje o materiałach i instrukcje pielęgnacji.' : 'We use a variety of high-quality materials including cotton, wool, silk, and sustainable synthetic blends. Each product page includes detailed material information and care instructions.',
      'faq.sizeExchange': t('language') === 'pl' ? 'Czy oferujecie wymianę rozmiarów?' : 'Do you have a size exchange policy?',
      'faq.sizeExchangeAnswer': t('language') === 'pl' ? 'Tak, oferujemy darmowe wymiany rozmiarów w ciągu 30 dni od zakupu. Przedmiot musi być w oryginalnym stanie z metkami. Wyślemy Ci opłaconą etykietę zwrotną i prześlemy nowy rozmiar po otrzymaniu oryginalnego przedmiotu.' : 'Yes, we offer free size exchanges within 30 days of purchase. The item must be in original condition with tags attached. We\'ll send you a prepaid return label and ship the new size once we receive the original item.'
    };

    return faqTranslations[key] || key;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('faqTitle')}</h1>
          <p className="text-xl text-gray-600">{t('faqSubtitle')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Filter */}
          <div className="lg:w-1/4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('categories')}</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{category.name}</span>
                    <span className="text-sm">{category.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="lg:w-3/4">
            <div className="space-y-4">
              {filteredFAQs.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-gray-900 pr-4">{getTranslatedText(item.questionKey)}</h3>
                    <i className={`ri-${openItem === item.id ? 'subtract' : 'add'}-line text-gray-400 flex-shrink-0`}></i>
                  </button>
                  
                  {openItem === item.id && (
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-gray-700 leading-relaxed">{getTranslatedText(item.answerKey)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-question-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {t('language') === 'pl' ? 'Nie znaleziono pytań' : 'No questions found'}
                </h3>
                <p className="text-gray-600">
                  {t('language') === 'pl' ? 'Spróbuj wybrać inną kategorię lub poszukaj konkretnych tematów.' : 'Try selecting a different category or search for specific topics.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('stillHaveQuestions')}</h2>
            <p className="text-gray-600 mb-6">{t('cantFindAnswer')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2">
                <i className="ri-mail-line text-gray-600"></i>
                <span className="text-gray-700">support@flame-fashion.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-phone-line text-gray-600"></i>
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                {t('language') === 'pl' 
                  ? 'Godziny obsługi klienta: Poniedziałek-Piątek 9:00-19:00 CET, Sobota-Niedziela 10:00-18:00 CET'
                  : 'Customer service hours: Monday-Friday 9AM-7PM EST, Saturday-Sunday 10AM-6PM EST'
                }
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}