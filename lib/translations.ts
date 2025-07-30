
// Import all translation files
import enTranslations from './i18n/locales/en.json';
import plTranslations from './i18n/locales/pl.json';
import itTranslations from './i18n/locales/it.json';
import ptTranslations from './i18n/locales/pt.json';
import frTranslations from './i18n/locales/fr.json';
import deTranslations from './i18n/locales/de.json';

// Comprehensive translations object
export const translations: Record<string, any> = {
  en: enTranslations,
  pl: plTranslations,
  it: itTranslations,
  pt: ptTranslations,
  fr: frTranslations,
  de: deTranslations
};

// Category mappings with comprehensive translations
export const categoryMapping: Record<string, any> = {
  en: {
    women: {
      name: "Women",
      subcategories: {
        dresses: "Dresses",
        tops: "Tops & Blouses",
        bottoms: "Pants & Skirts",
        outerwear: "Jackets & Coats",
        shoes: "Shoes",
        lingerie: "Lingerie",
        activewear: "Activewear",
        swimwear: "Swimwear"
      }
    },
    men: {
      name: "Men",
      subcategories: {
        shirts: "Shirts",
        pants: "Pants",
        suits: "Suits",
        outerwear: "Jackets & Coats",
        shoes: "Shoes",
        underwear: "Underwear",
        activewear: "Activewear",
        accessories: "Accessories"
      }
    },
    accessories: {
      name: "Accessories",
      subcategories: {
        bags: "Bags & Purses",
        jewelry: "Jewelry",
        watches: "Watches",
        sunglasses: "Sunglasses",
        scarves: "Scarves",
        belts: "Belts",
        hats: "Hats",
        tech: "Tech Accessories"
      }
    },
    sale: {
      name: "Sale",
      subcategories: {
        newArrivals: "New Arrivals",
        bestSellers: "Best Sellers",
        discounts: "Discounted Items",
        clearance: "Clearance"
      }
    }
  },
  pl: {
    women: {
      name: "Kobiety",
      subcategories: {
        dresses: "Sukienki",
        tops: "Bluzki i Topy",
        bottoms: "Spodnie i Spódnice",
        outerwear: "Kurtki i Płaszcze",
        shoes: "Buty",
        lingerie: "Bielizna",
        activewear: "Odzież Sportowa",
        swimwear: "Stroje Kąpielowe"
      }
    },
    men: {
      name: "Mężczyźni",
      subcategories: {
        shirts: "Koszule",
        pants: "Spodnie",
        suits: "Garnitury",
        outerwear: "Kurtki i Płaszcze",
        shoes: "Buty",
        underwear: "Bielizna",
        activewear: "Odzież Sportowa",
        accessories: "Akcesoria"
      }
    },
    accessories: {
      name: "Akcesoria",
      subcategories: {
        bags: "Torby i Torebki",
        jewelry: "Biżuteria",
        watches: "Zegarki",
        sunglasses: "Okulary Przeciwsłoneczne",
        scarves: "Szaliki",
        belts: "Paski",
        hats: "Czapki",
        tech: "Akcesoria Techniczne"
      }
    },
    sale: {
      name: "Wyprzedaż",
      subcategories: {
        newArrivals: "Nowości",
        bestSellers: "Bestsellery",
        discounts: "Produkty z Rabatem",
        clearance: "Wyprzedaż"
      }
    }
  },
  it: {
    women: {
      name: "Donna",
      subcategories: {
        dresses: "Vestiti",
        tops: "Top e Bluse",
        bottoms: "Pantaloni e Gonne",
        outerwear: "Giacche e Cappotti",
        shoes: "Scarpe",
        lingerie: "Intimo",
        activewear: "Abbigliamento Sportivo",
        swimwear: "Costumi da Bagno"
      }
    },
    men: {
      name: "Uomo",
      subcategories: {
        shirts: "Camicie",
        pants: "Pantaloni",
        suits: "Completi",
        outerwear: "Giacche e Cappotti",
        shoes: "Scarpe",
        underwear: "Intimo",
        activewear: "Abbigliamento Sportivo",
        accessories: "Accessori"
      }
    },
    accessories: {
      name: "Accessori",
      subcategories: {
        bags: "Borse",
        jewelry: "Gioielli",
        watches: "Orologi",
        sunglasses: "Occhiali da Sole",
        scarves: "Sciarpe",
        belts: "Cinture",
        hats: "Cappelli",
        tech: "Accessori Tech"
      }
    },
    sale: {
      name: "Saldi",
      subcategories: {
        newArrivals: "Nuovi Arrivi",
        bestSellers: "Più Venduti",
        discounts: "Articoli Scontati",
        clearance: "Liquidazione"
      }
    }
  },
  pt: {
    women: {
      name: "Mulheres",
      subcategories: {
        dresses: "Vestidos",
        tops: "Blusas e Tops",
        bottoms: "Calças e Saias",
        outerwear: "Casacos e Jaquetas",
        shoes: "Sapatos",
        lingerie: "Lingerie",
        activewear: "Roupas Esportivas",
        swimwear: "Roupas de Banho"
      }
    },
    men: {
      name: "Homens",
      subcategories: {
        shirts: "Camisas",
        pants: "Calças",
        suits: "Ternos",
        outerwear: "Casacos e Jaquetas",
        shoes: "Sapatos",
        underwear: "Roupa Íntima",
        activewear: "Roupas Esportivas",
        accessories: "Acessórios"
      }
    },
    accessories: {
      name: "Acessórios",
      subcategories: {
        bags: "Bolsas",
        jewelry: "Joias",
        watches: "Relógios",
        sunglasses: "Óculos de Sol",
        scarves: "Lenços",
        belts: "Cintos",
        hats: "Chapéus",
        tech: "Acessórios Tech"
      }
    },
    sale: {
      name: "Promoção",
      subcategories: {
        newArrivals: "Novidades",
        bestSellers: "Mais Vendidos",
        discounts: "Itens com Desconto",
        clearance: "Liquidação"
      }
    }
  },
  fr: {
    women: {
      name: "Femmes",
      subcategories: {
        dresses: "Robes",
        tops: "Hauts et Blouses",
        bottoms: "Pantalons et Jupes",
        outerwear: "Vestes et Manteaux",
        shoes: "Chaussures",
        lingerie: "Lingerie",
        activewear: "Vêtements de Sport",
        swimwear: "Maillots de Bain"
      }
    },
    men: {
      name: "Hommes",
      subcategories: {
        shirts: "Chemises",
        pants: "Pantalons",
        suits: "Costumes",
        outerwear: "Vestes et Manteaux",
        shoes: "Chaussures",
        underwear: "Sous-vêtements",
        activewear: "Vêtements de Sport",
        accessories: "Accessoires"
      }
    },
    accessories: {
      name: "Accessoires",
      subcategories: {
        bags: "Sacs",
        jewelry: "Bijoux",
        watches: "Montres",
        sunglasses: "Lunettes de Soleil",
        scarves: "Écharpes",
        belts: "Ceintures",
        hats: "Chapeaux",
        tech: "Accessoires Tech"
      }
    },
    sale: {
      name: "Soldes",
      subcategories: {
        newArrivals: "Nouveautés",
        bestSellers: "Meilleures Ventes",
        discounts: "Articles en Promotion",
        clearance: "Liquidation"
      }
    }
  },
  de: {
    women: {
      name: "Damen",
      subcategories: {
        dresses: "Kleider",
        tops: "Oberteile & Blusen",
        bottoms: "Hosen & Röcke",
        outerwear: "Jacken & Mäntel",
        shoes: "Schuhe",
        lingerie: "Dessous",
        activewear: "Sportbekleidung",
        swimwear: "Bademode"
      }
    },
    men: {
      name: "Herren",
      subcategories: {
        shirts: "Hemden",
        pants: "Hosen",
        suits: "Anzüge",
        outerwear: "Jacken & Mäntel",
        shoes: "Schuhe",
        underwear: "Unterwäsche",
        activewear: "Sportbekleidung",
        accessories: "Accessoires"
      }
    },
    accessories: {
      name: "Accessoires",
      subcategories: {
        bags: "Taschen",
        jewelry: "Schmuck",
        watches: "Uhren",
        sunglasses: "Sonnenbrillen",
        scarves: "Schals",
        belts: "Gürtel",
        hats: "Hüte",
        tech: "Tech-Accessoires"
      }
    },
    sale: {
      name: "Sale",
      subcategories: {
        newArrivals: "Neuheiten",
        bestSellers: "Bestseller",
        discounts: "Reduzierte Artikel",
        clearance: "Räumungsverkauf"
      }
    }
  }
};

// Exchange rates for currency conversion
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  PLN: 4.05,
  GBP: 0.79
};

// Currency symbols
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  PLN: 'zł',
  GBP: '£'
};

export function getExchangeRates(): Record<string, number> {
  return exchangeRates;
}

export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || currency;
}

export function convertPrice(price: number, fromCurrency: string = 'USD', toCurrency: string = 'USD'): number {
  if (fromCurrency === toCurrency) return price;
  
  // Convert to USD first
  const usdPrice = price / exchangeRates[fromCurrency];
  
  // Then convert to target currency
  return usdPrice * exchangeRates[toCurrency];
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  const symbol = getCurrencySymbol(currency);
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  
  // Place symbol according to currency convention
  switch (currency) {
    case 'EUR':
      return `${formattedNumber}${symbol}`;
    case 'PLN':
      return `${formattedNumber} ${symbol}`;
    default:
      return `${symbol}${formattedNumber}`;
  }
}

// Add translation functions for better integration
export function getTranslation(key: string, language: string = 'en', params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[language] || translations.en;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key;
        }
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace parameters
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    });
  }
  
  return value;
}

// Get localized category data
export function getLocalizedCategory(category: string, language: string = 'en'): any {
  return categoryMapping[language]?.[category] || categoryMapping.en[category];
}

// Get all available languages
export function getAvailableLanguages(): Array<{code: string, name: string, nativeName: string, flag: string}> {
  return [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
  ];
}

// Get all available currencies
export function getAvailableCurrencies(): Array<{code: string, symbol: string, name: string}> {
  return [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];
}

// Add missing exports for compatibility
export function getSupportedLanguages() {
  return getAvailableLanguages();
}

export function getSupportedCurrencies() {
  return getAvailableCurrencies();
}

export function getCategoryName(category: string, language: string = 'en'): string {
  return categoryMapping[language]?.[category]?.name || categoryMapping.en[category]?.name || category;
}

export function getSubcategoryName(category: string, subcategory: string, language: string = 'en'): string {
  return categoryMapping[language]?.[category]?.subcategories?.[subcategory] || 
         categoryMapping.en[category]?.subcategories?.[subcategory] || subcategory;
}

export function getTranslatedProductData(product: any, language: string = 'en') {
  // This is a placeholder function - implement based on your needs
  return {
    name: product.name,
    description: product.description,
    // Add more translated fields as needed
  };
}
