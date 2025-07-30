'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('aboutUs')} Flame Fashion</h1>
          
          <div className="space-y-8">
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('ourStory')}</h2>
                  <p className="text-gray-700 mb-4">
                    {t('language') === 'pl' 
                      ? 'Założona w 2020 roku, Flame Fashion rozpoczęła jako mały butik z wielką wizją: uczynić wysokiej jakości, stylową odzież dostępną dla wszystkich. To, co rozpoczęło się jako projekt pasji, rozrosło się w zaufane miejsce zakupów mody dla klientów na całym świecie.'
                      : 'Founded in 2020, Flame Fashion began as a small boutique with a big vision: to make high-quality, stylish clothing accessible to everyone. What started as a passion project has grown into a trusted fashion destination for customers worldwide.'
                    }
                  </p>
                  <p className="text-gray-700">
                    {t('language') === 'pl'
                      ? 'Wierzymy, że moda powinna być zarówno piękna, jak i zrównoważona. Każdy element naszej kolekcji jest starannie wybrany pod kątem jakości, stylu i etycznych praktyk produkcyjnych.'
                      : 'We believe that fashion should be both beautiful and sustainable. Every piece in our collection is carefully selected for its quality, style, and ethical production practices.'
                    }
                  </p>
                </div>
                <div>
                  <img 
                    src="https://readdy.ai/api/search-image?query=modern%20fashion%20boutique%20interior%2C%20stylish%20clothing%20store%20design%2C%20professional%20retail%20space%2C%20clean%20minimal%20aesthetic%2C%20fashion%20brand%20showroom&width=500&height=400&seq=about-store&orientation=landscape" 
                    alt="Flame Fashion Store" 
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('ourMission')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-shirt-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('qualityFirst')}</h3>
                  <p className="text-gray-600">{t('qualityFirstDesc')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-earth-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('sustainabilityTitle')}</h3>
                  <p className="text-gray-600">{t('sustainabilityDesc')}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-heart-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('customerCare')}</h3>
                  <p className="text-gray-600">{t('customerCareDesc')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('meetOurTeam')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <img 
                    src="https://readdy.ai/api/search-image?query=professional%20fashion%20designer%20portrait%2C%20creative%20director%20headshot%2C%20stylish%20woman%20in%20modern%20office%2C%20clean%20studio%20photography%2C%20fashion%20industry%20professional&width=300&height=400&seq=team-sarah&orientation=portrait" 
                    alt="Sarah Johnson" 
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
                  <p className="text-gray-600">
                    {t('language') === 'pl' ? 'Założycielka i Dyrektor Kreatywny' : 'Founder & Creative Director'}
                  </p>
                </div>
                <div className="text-center">
                  <img 
                    src="https://readdy.ai/api/search-image?query=fashion%20buyer%20professional%20portrait%2C%20retail%20manager%20headshot%2C%20confident%20man%20in%20business%20attire%2C%20clean%20studio%20photography%2C%20fashion%20industry%20professional&width=300&height=400&seq=team-mike&orientation=portrait" 
                    alt="Mike Chen" 
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">Mike Chen</h3>
                  <p className="text-gray-600">
                    {t('language') === 'pl' ? 'Kierownik Operacyjny' : 'Head of Operations'}
                  </p>
                </div>
                <div className="text-center">
                  <img 
                    src="https://readdy.ai/api/search-image?query=fashion%20stylist%20professional%20portrait%2C%20creative%20woman%20in%20trendy%20outfit%2C%20fashion%20industry%20professional%2C%20clean%20studio%20photography%2C%20modern%20workplace&width=300&height=400&seq=team-emma&orientation=portrait" 
                    alt="Emma Rodriguez" 
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">Emma Rodriguez</h3>
                  <p className="text-gray-600">
                    {t('language') === 'pl' ? 'Główny Stylista' : 'Lead Stylist'}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-black text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">{t('joinOurCommunity')}</h2>
              <p className="text-gray-300 mb-6">
                {t('language') === 'pl'
                  ? 'Śledź nas w mediach społecznościowych, aby być na bieżąco z najnowszymi trendami, ekskluzywymi ofertami i materiałami zza kulis z Flame Fashion.'
                  : 'Follow us on social media to stay updated with the latest trends, exclusive offers, and behind-the-scenes content from Flame Fashion.'
                }
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="ri-instagram-line text-xl"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="ri-facebook-line text-xl"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="ri-twitter-line text-xl"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="ri-pinterest-line text-xl"></i>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}