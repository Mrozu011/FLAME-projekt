'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function PagesManagement() {
  const { t, language, changeLanguage } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [activePage, setActivePage] = useState('about');
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' }
  ];

  const pages = [
    { 
      id: 'about', 
      name: 'About Us', 
      icon: 'ri-information-line',
      description: 'Company story, mission, and team information'
    },
    { 
      id: 'contact', 
      name: 'Contact', 
      icon: 'ri-phone-line',
      description: 'Contact information, form, and locations'
    },
    { 
      id: 'faq', 
      name: 'FAQ', 
      icon: 'ri-question-line',
      description: 'Frequently asked questions and answers'
    },
    { 
      id: 'shipping', 
      name: 'Shipping', 
      icon: 'ri-truck-line',
      description: 'Shipping information and policies'
    },
    { 
      id: 'returns', 
      name: 'Returns', 
      icon: 'ri-arrow-left-right-line',
      description: 'Return and exchange policies'
    },
    { 
      id: 'privacy', 
      name: 'Privacy Policy', 
      icon: 'ri-shield-line',
      description: 'Privacy policy and data protection'
    },
    { 
      id: 'terms', 
      name: 'Terms of Service', 
      icon: 'ri-file-text-line',
      description: 'Terms and conditions'
    },
    { 
      id: 'cookies', 
      name: 'Cookie Policy', 
      icon: 'ri-file-shield-line',
      description: 'Cookie usage and preferences'
    },
    { 
      id: 'accessibility', 
      name: 'Accessibility', 
      icon: 'ri-accessibility-line',
      description: 'Accessibility statement and features'
    },
    { 
      id: 'careers', 
      name: 'Careers', 
      icon: 'ri-briefcase-line',
      description: 'Job opportunities and company culture'
    },
    { 
      id: 'press', 
      name: 'Press', 
      icon: 'ri-newspaper-line',
      description: 'Press releases and media resources'
    },
    { 
      id: 'sustainability', 
      name: 'Sustainability', 
      icon: 'ri-leaf-line',
      description: 'Environmental and social responsibility'
    },
    { 
      id: 'size-guide', 
      name: 'Size Guide', 
      icon: 'ri-ruler-line',
      description: 'Size charts and measurement guides'
    }
  ];

  const [pageContent, setPageContent] = useState({
    about: {
      hero: {
        title: { en: 'About Flame Fashion', pl: 'O Flame Fashion', it: 'Chi Siamo', pt: 'Sobre a Flame Fashion', fr: 'À Propos de Flame Fashion', de: 'Über Flame Fashion' },
        subtitle: { 
          en: 'Founded in 2020, Flame Fashion began as a small boutique with a big vision: to make high-quality, stylish clothing accessible to everyone.',
          pl: 'Założona w 2020 roku, Flame Fashion rozpoczęła jako mały butik z wielką wizją: uczynić wysokiej jakości, stylową odzież dostępną dla wszystkich.',
          it: 'Fondata nel 2020, Flame Fashion è iniziata come una piccola boutique con una grande visione: rendere l\'abbigliamento di alta qualità e alla moda accessibile a tutti.',
          pt: 'Fundada em 2020, a Flame Fashion começou como uma pequena boutique com uma grande visão: tornar roupas elegantes e de alta qualidade acessíveis a todos.',
          fr: 'Fondée en 2020, Flame Fashion a commencé comme une petite boutique avec une grande vision : rendre les vêtements élégants et de haute qualité accessibles à tous.',
          de: 'Gegründet im Jahr 2020, begann Flame Fashion als kleine Boutique mit einer großen Vision: hochwertige, stilvolle Kleidung für alle zugänglich zu machen.'
        }
      },
      mission: {
        title: { en: 'Our Mission', pl: 'Nasza Misja', it: 'La Nostra Missione', pt: 'Nossa Missão', fr: 'Notre Mission', de: 'Unsere Mission' },
        description: {
          en: 'We believe that fashion should be both beautiful and sustainable. Every piece in our collection is carefully selected for its quality, style, and ethical production practices.',
          pl: 'Wierzymy, że moda powinna być zarówno piękna, jak i zrównoważona. Każdy element naszej kolekcji jest starannie wybrany pod kątem jakości, stylu i etycznych praktyk produkcyjnych.',
          it: 'Crediamo che la moda debba essere sia bella che sostenibile. Ogni pezzo della nostra collezione è accuratamente selezionato per la sua qualità, stile e pratiche di produzione etiche.',
          pt: 'Acreditamos que a moda deve ser bonita e sustentável. Cada peça em nossa coleção é cuidadosamente selecionada por sua qualidade, estilo e práticas de produção éticas.',
          fr: 'Nous croyons que la mode doit être à la fois belle et durable. Chaque pièce de notre collection est soigneusement sélectionnée pour sa qualité, son style et ses pratiques de production éthiques.',
          de: 'Wir glauben, dass Mode sowohl schön als auch nachhaltig sein sollte. Jedes Stück in unserer Kollektion wird sorgfältig nach Qualität, Stil und ethischen Produktionspraktiken ausgewählt.'
        }
      },
      visibility: { en: true, pl: true, it: true, pt: true, fr: true, de: true }
    },
    contact: {
      hero: {
        title: { en: 'Contact Us', pl: 'Skontaktuj się z nami', it: 'Contattaci', pt: 'Entre em Contato', fr: 'Contactez-nous', de: 'Kontaktieren Sie uns' },
        subtitle: {
          en: 'We\'re here to help! Get in touch with our team for any questions, support, or feedback.',
          pl: 'Jesteśmy tutaj, aby pomóc! Skontaktuj się z naszym zespołem w przypadku pytań, wsparcia lub opinii.',
          it: 'Siamo qui per aiutarti! Contatta il nostro team per qualsiasi domanda, supporto o feedback.',
          pt: 'Estamos aqui para ajudar! Entre em contato com nossa equipe para perguntas, suporte ou feedback.',
          fr: 'Nous sommes là pour vous aider ! Contactez notre équipe pour toute question, support ou commentaire.',
          de: 'Wir sind hier, um zu helfen! Kontaktieren Sie unser Team bei Fragen, Support oder Feedback.'
        }
      },
      contact_info: {
        address: {
          en: '123 Fashion Street, New York, NY 10001, United States',
          pl: '123 Fashion Street, New York, NY 10001, Stany Zjednoczone',
          it: '123 Fashion Street, New York, NY 10001, Stati Uniti',
          pt: '123 Fashion Street, New York, NY 10001, Estados Unidos',
          fr: '123 Fashion Street, New York, NY 10001, États-Unis',
          de: '123 Fashion Street, New York, NY 10001, Vereinigte Staaten'
        },
        phone: '+1 (555) 123-4567',
        email: 'support@flame-fashion.com',
        hours: {
          en: 'Mon-Fri 9AM-7PM EST',
          pl: 'Pon-Pt 9:00-19:00 CET',
          it: 'Lun-Ven 9:00-19:00 CET',
          pt: 'Seg-Sex 9:00-19:00 CET',
          fr: 'Lun-Ven 9h-19h CET',
          de: 'Mo-Fr 9:00-19:00 CET'
        }
      },
      visibility: { en: true, pl: true, it: true, pt: true, fr: true, de: true }
    }
  });

  const [jobOpenings, setJobOpenings] = useState([
    {
      id: 1,
      title: {
        en: 'Senior Fashion Designer',
        pl: 'Starszy Projektant Mody',
        it: 'Designer di Moda Senior',
        pt: 'Designer de Moda Sênior',
        fr: 'Designer de Mode Senior',
        de: 'Senior Modedesigner'
      },
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      description: {
        en: 'Lead our design team in creating innovative fashion collections that define trends and inspire customers worldwide.',
        pl: 'Prowadź nasz zespół projektowy w tworzeniu innowacyjnych kolekcji modowych, które definiują trendy i inspirują klientów na całym świecie.',
        it: 'Guida il nostro team di design nella creazione di collezioni di moda innovative che definiscono le tendenze e ispirano i clienti in tutto il mondo.',
        pt: 'Lidere nossa equipe de design na criação de coleções de moda inovadoras que definem tendências e inspiram clientes no mundo todo.',
        fr: 'Dirigez notre équipe de design dans la création de collections de mode innovantes qui définissent les tendances et inspirent les clients du monde entier.',
        de: 'Leiten Sie unser Designteam bei der Erstellung innovativer Modekollektionen, die Trends definieren und Kunden weltweit inspirieren.'
      },
      requirements: {
        en: ['Bachelor\'s degree in Fashion Design', '5+ years experience', 'Strong portfolio', 'Leadership skills'],
        pl: ['Licencjat z projektowania mody', '5+ lat doświadczenia', 'Silne portfolio', 'Umiejętności przywódcze'],
        it: ['Laurea in Design della Moda', '5+ anni di esperienza', 'Portfolio solido', 'Capacità di leadership'],
        pt: ['Diploma em Design de Moda', '5+ anos de experiência', 'Portfólio forte', 'Habilidades de liderança'],
        fr: ['Diplôme en Design de Mode', '5+ années d\'expérience', 'Portfolio solide', 'Compétences en leadership'],
        de: ['Bachelor-Abschluss in Modedesign', '5+ Jahre Erfahrung', 'Starkes Portfolio', 'Führungsqualitäten']
      },
      active: true,
      postedDate: '2024-01-15'
    }
  ]);

  const [pressReleases, setPressReleases] = useState([
    {
      id: 1,
      title: {
        en: 'Flame Fashion Launches Sustainable Collection for Spring 2024',
        pl: 'Flame Fashion wprowadza zrównoważoną kolekcję na wiosnę 2024',
        it: 'Flame Fashion lancia una collezione sostenibile per la primavera 2024',
        pt: 'Flame Fashion lança coleção sustentável para primavera de 2024',
        fr: 'Flame Fashion lance une collection durable pour le printemps 2024',
        de: 'Flame Fashion startet nachhaltige Kollektion für Frühjahr 2024'
      },
      summary: {
        en: 'Flame Fashion announces its most sustainable collection yet, featuring eco-friendly materials and carbon-neutral shipping.',
        pl: 'Flame Fashion ogłasza swoją najbardziej zrównoważoną kolekcję, zawierającą ekologiczne materiały i wysyłkę neutralną węglowo.',
        it: 'Flame Fashion annuncia la sua collezione più sostenibile di sempre, con materiali ecologici e spedizioni carbon neutral.',
        pt: 'Flame Fashion anuncia sua coleção mais sustentável até agora, com materiais ecológicos e envio neutro em carbono.',
        fr: 'Flame Fashion annonce sa collection la plus durable à ce jour, avec des matériaux écologiques et une expédition neutre en carbone.',
        de: 'Flame Fashion kündigt seine bisher nachhaltigste Kollektion an, mit umweltfreundlichen Materialien und CO2-neutralem Versand.'
      },
      category: 'Product Launch',
      date: '2024-03-15',
      visibility: { en: true, pl: true, it: true, pt: true, fr: true, de: true }
    }
  ]);

  const handleLanguageChange = (langCode) => {
    setActiveLanguage(langCode);
    changeLanguage(langCode);
  };

  const handlePageContentChange = (section, field, value) => {
    setPageContent(prev => ({
      ...prev,
      [activePage]: {
        ...prev[activePage],
        [section]: {
          ...prev[activePage][section],
          [field]: {
            ...prev[activePage][section][field],
            [activeLanguage]: value
          }
        }
      }
    }));
  };

  const handleVisibilityToggle = (pageId) => {
    setPageContent(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        visibility: {
          ...prev[pageId].visibility,
          [activeLanguage]: !prev[pageId].visibility[activeLanguage]
        }
      }
    }));
  };

  const handleSavePageContent = async () => {
    setSubmitStatus({ type: 'loading', message: 'Saving page content...' });

    try {
      const formData = new URLSearchParams();
      formData.append('pageId', activePage);
      formData.append('language', activeLanguage);
      formData.append('content', JSON.stringify(pageContent[activePage]));
      formData.append('formType', 'pageContent');

      const response = await fetch('https://readdy.ai/api/form/d24787mb5t8jehpp9vsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Page content saved successfully!' });
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to save page content.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error occurred.' });
    }
  };

  const handleAddJobOpening = () => {
    const newJob = {
      id: Date.now(),
      title: supportedLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: '' }), {}),
      department: '',
      location: '',
      type: 'Full-time',
      description: supportedLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: '' }), {}),
      requirements: supportedLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: [] }), {}),
      active: true,
      postedDate: new Date().toISOString().split('T')[0]
    };
    setJobOpenings(prev => [...prev, newJob]);
  };

  const handleAddPressRelease = () => {
    const newRelease = {
      id: Date.now(),
      title: supportedLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: '' }), {}),
      summary: supportedLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: '' }), {}),
      category: 'General',
      date: new Date().toISOString().split('T')[0],
      visibility: supportedLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: true }), {})
    };
    setPressReleases(prev => [...prev, newRelease]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Language:</label>
                <select
                  value={activeLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
                >
                  {supportedLanguages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSavePageContent}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-save-line mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {submitStatus.message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : submitStatus.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {submitStatus.type === 'loading' && (
              <i className="ri-loader-4-line animate-spin mr-2"></i>
            )}
            {submitStatus.type === 'success' && (
              <i className="ri-check-circle-line mr-2"></i>
            )}
            {submitStatus.type === 'error' && (
              <i className="ri-error-warning-line mr-2"></i>
            )}
            {submitStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Pages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Static Pages</h2>
                <p className="text-sm text-gray-600">Manage all static pages</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      activePage === page.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <i className={`${page.icon} text-gray-600`}></i>
                        <div>
                          <h3 className="font-medium text-gray-900">{page.name}</h3>
                          <p className="text-xs text-gray-500">{page.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {pageContent[page.id]?.visibility?.[activeLanguage] ? (
                          <i className="ri-eye-line text-green-500 text-sm"></i>
                        ) : (
                          <i className="ri-eye-off-line text-gray-400 text-sm"></i>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Page Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {pages.find(p => p.id === activePage)?.name} - {supportedLanguages.find(l => l.code === activeLanguage)?.nativeName}
                    </h2>
                    <p className="text-sm text-gray-600">Edit page content for {activeLanguage.toUpperCase()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pageContent[activePage]?.visibility?.[activeLanguage] || false}
                        onChange={() => handleVisibilityToggle(activePage)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Visible in {activeLanguage.toUpperCase()}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* General Page Content Editor */}
                {activePage !== 'careers' && activePage !== 'press' && (
                  <div className="space-y-6">
                    {/* Hero Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={pageContent[activePage]?.hero?.title?.[activeLanguage] || ''}
                            onChange={(e) => handlePageContentChange('hero', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter page title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                          <textarea
                            value={pageContent[activePage]?.hero?.subtitle?.[activeLanguage] || ''}
                            onChange={(e) => handlePageContentChange('hero', 'subtitle', e.target.value)}
                            rows={3}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter page subtitle"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {pageContent[activePage]?.hero?.subtitle?.[activeLanguage]?.length || 0}/500 characters
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Page Specific Fields */}
                    {activePage === 'contact' && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <textarea
                              value={pageContent[activePage]?.contact_info?.address?.[activeLanguage] || ''}
                              onChange={(e) => handlePageContentChange('contact_info', 'address', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                            <input
                              type="text"
                              value={pageContent[activePage]?.contact_info?.hours?.[activeLanguage] || ''}
                              onChange={(e) => handlePageContentChange('contact_info', 'hours', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Careers Page Special Editor */}
                {activePage === 'careers' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Job Openings</h3>
                      <button
                        onClick={handleAddJobOpening}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Add Job Opening
                      </button>
                    </div>

                    <div className="space-y-4">
                      {jobOpenings.map(job => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Job #{job.id}</h4>
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={job.active}
                                  onChange={(e) => {
                                    setJobOpenings(prev => prev.map(j => 
                                      j.id === job.id ? { ...j, active: e.target.checked } : j
                                    ));
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                              </label>
                              <button
                                onClick={() => {
                                  setJobOpenings(prev => prev.filter(j => j.id !== job.id));
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title ({activeLanguage.toUpperCase()})</label>
                              <input
                                type="text"
                                value={job.title[activeLanguage] || ''}
                                onChange={(e) => {
                                  setJobOpenings(prev => prev.map(j => 
                                    j.id === job.id ? { 
                                      ...j, 
                                      title: { ...j.title, [activeLanguage]: e.target.value } 
                                    } : j
                                  ));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                              <select
                                value={job.department}
                                onChange={(e) => {
                                  setJobOpenings(prev => prev.map(j => 
                                    j.id === job.id ? { ...j, department: e.target.value } : j
                                  ));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                              >
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operations">Operations</option>
                                <option value="Customer Service">Customer Service</option>
                                <option value="Digital">Digital</option>
                                <option value="Creative">Creative</option>
                              </select>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description ({activeLanguage.toUpperCase()})</label>
                            <textarea
                              value={job.description[activeLanguage] || ''}
                              onChange={(e) => {
                                setJobOpenings(prev => prev.map(j => 
                                  j.id === job.id ? { 
                                    ...j, 
                                    description: { ...j.description, [activeLanguage]: e.target.value } 
                                  } : j
                                ));
                              }}
                              rows={3}
                              maxLength={500}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Press Page Special Editor */}
                {activePage === 'press' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Press Releases</h3>
                      <button
                        onClick={handleAddPressRelease}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Add Press Release
                      </button>
                    </div>

                    <div className="space-y-4">
                      {pressReleases.map(release => (
                        <div key={release.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Release #{release.id}</h4>
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={release.visibility[activeLanguage]}
                                  onChange={(e) => {
                                    setPressReleases(prev => prev.map(r => 
                                      r.id === release.id ? { 
                                        ...r, 
                                        visibility: { ...r.visibility, [activeLanguage]: e.target.checked } 
                                      } : r
                                    ));
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Visible</span>
                              </label>
                              <button
                                onClick={() => {
                                  setPressReleases(prev => prev.filter(r => r.id !== release.id));
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title ({activeLanguage.toUpperCase()})</label>
                              <input
                                type="text"
                                value={release.title[activeLanguage] || ''}
                                onChange={(e) => {
                                  setPressReleases(prev => prev.map(r => 
                                    r.id === release.id ? { 
                                      ...r, 
                                      title: { ...r.title, [activeLanguage]: e.target.value } 
                                    } : r
                                  ));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Summary ({activeLanguage.toUpperCase()})</label>
                              <textarea
                                value={release.summary[activeLanguage] || ''}
                                onChange={(e) => {
                                  setPressReleases(prev => prev.map(r => 
                                    r.id === release.id ? { 
                                      ...r, 
                                      summary: { ...r.summary, [activeLanguage]: e.target.value } 
                                    } : r
                                  ));
                                }}
                                rows={3}
                                maxLength={500}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                  value={release.category}
                                  onChange={(e) => {
                                    setPressReleases(prev => prev.map(r => 
                                      r.id === release.id ? { ...r, category: e.target.value } : r
                                    ));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                                >
                                  <option value="Product Launch">Product Launch</option>
                                  <option value="Awards">Awards</option>
                                  <option value="Business">Business</option>
                                  <option value="Community">Community</option>
                                  <option value="Store Opening">Store Opening</option>
                                  <option value="General">General</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                  type="date"
                                  value={release.date}
                                  onChange={(e) => {
                                    setPressReleases(prev => prev.map(r => 
                                      r.id === release.id ? { ...r, date: e.target.value } : r
                                    ));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Language Coverage Overview */}
        <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Language Coverage Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {supportedLanguages.map(lang => (
              <div key={lang.code} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{lang.code.toUpperCase()}</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm">{lang.nativeName}</h4>
                <p className="text-xs text-gray-500">
                  {pages.filter(p => pageContent[p.id]?.visibility?.[lang.code]).length}/{pages.length} pages
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}