import { translations } from '@/lib/translations';

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  relatedTopics: string[];
  videoUrl?: string;
  priority: number;
  route?: string;
}

export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export class AdminHelpSystem {
  private static instance: AdminHelpSystem;
  private helpTopics: Map<string, HelpTopic> = new Map();
  private categories: Map<string, HelpCategory> = new Map();

  private constructor() {
    this.initializeHelpSystem();
  }

  static getInstance(): AdminHelpSystem {
    if (!AdminHelpSystem.instance) {
      AdminHelpSystem.instance = new AdminHelpSystem();
    }
    return AdminHelpSystem.instance;
  }

  private initializeHelpSystem(): void {
    this.initializeCategories();
    this.initializeHelpTopics();
  }

  private initializeCategories(): void {
    const categories: HelpCategory[] = [
      {
        id: 'getting-started',
        name: 'Rozpoczynanie pracy',
        description: 'Podstawowe informacje o rozpoczęciu pracy z panelem',
        icon: 'ri-rocket-line',
        order: 1
      },
      {
        id: 'products',
        name: 'Produkty',
        description: 'Zarządzanie katalogiem produktów',
        icon: 'ri-box-3-line',
        order: 2
      },
      {
        id: 'orders',
        name: 'Zamówienia',
        description: 'Przetwarzanie i zarządzanie zamówieniami',
        icon: 'ri-shopping-bag-line',
        order: 3
      },
      {
        id: 'customers',
        name: 'Klienci',
        description: 'Zarządzanie kontami i danymi klientów',
        icon: 'ri-user-line',
        order: 4
      },
      {
        id: 'analytics',
        name: 'Analityka',
        description: 'Raporty i analiza wydajności',
        icon: 'ri-bar-chart-line',
        order: 5
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Kampanie, promocje i rabaty',
        icon: 'ri-megaphone-line',
        order: 6
      },
      {
        id: 'settings',
        name: 'Ustawienia',
        description: 'Konfiguracja systemu i preferencje',
        icon: 'ri-settings-3-line',
        order: 7
      },
      {
        id: 'troubleshooting',
        name: 'Rozwiązywanie problemów',
        description: 'Częste problemy i ich rozwiązania',
        icon: 'ri-tools-line',
        order: 8
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  private initializeHelpTopics(): void {
    const topics: HelpTopic[] = [
      // Dashboard / Panel główny
      {
        id: 'dashboard-overview',
        title: 'Panel główny - Przegląd',
        description: 'Zrozumienie głównego panelu analitycznego i jego funkcji',
        content: `
# Panel główny - Jak używać

Panel główny to centrum kontroli Twojego sklepu internetowego. Tutaj znajdziesz wszystkie najważniejsze informacje i wskaźniki.

## Główne sekcje:

### 1. Przychody
- **Dzisiejsze przychody**: Suma wszystkich płatności otrzymanych dzisiaj
- **Miesięczne przychody**: Łączne przychody w bieżącym miesiącu
- **Przychody całkowite**: Suma wszystkich przychodów od początku działalności

### 2. Wskaźniki ruchu
- **Dzisiejsi odwiedzający**: Liczba unikalnych użytkowników na stronie
- **Współczynnik odrzuceń**: Procent użytkowników, którzy opuścili stronę bez interakcji
- **Średnia sesja**: Średni czas spędzony przez użytkownika na stronie
- **Współczynnik konwersji**: Procent odwiedzających, którzy dokonali zakupu

### 3. Najlepiej sprzedające się produkty
Lista 5 produktów generujących największe przychody wraz z liczbą sprzedanych jednostek.

### 4. Zamówienia według statusu
Podział wszystkich zamówień według ich aktualnego statusu (oczekuje, przetwarzane, wysłane, itp.)

### 5. Ostatnie zamówienia
Lista najnowszych zamówień z podstawowymi informacjami o kliencie i statusie.

### 6. Ostatnia aktywność
Chronologiczna lista ostatnich działań w systemie (nowe zamówienia, rejestracje, aktualizacje produktów).

## Filtry czasowe:
- Ostatnie 7 dni
- Ostatnie 30 dni  
- Ostatnie 90 dni
- Ostatni rok
- Zakres niestandardowy

## Eksport danych:
Możesz wyeksportować dane analityczne w formacie CSV lub Excel dla dalszej analizy.
        `,
        category: 'getting-started',
        tags: ['dashboard', 'analytics', 'overview', 'revenue', 'podstawy'],
        lastUpdated: new Date().toISOString(),
        relatedTopics: ['analytics-reports', 'revenue-tracking'],
        priority: 1,
        route: '/admin'
      },
      
      // Products / Produkty
      {
        id: 'products-management',
        title: 'Zarządzanie produktami',
        description: 'Jak dodawać, edytować i organizować produkty w katalogu',
        content: `
# Zarządzanie produktami

Sekcja produktów pozwala na pełne zarządzanie katalogiem Twojego sklepu.

## Dodawanie nowego produktu:

### 1. Kliknij "Dodaj produkt"
### 2. Wypełnij podstawowe informacje:
- **Nazwa produktu**: Jasna, opisowa nazwa
- **Opis**: Szczegółowy opis produktu
- **Krótki opis**: Zwięzłe podsumowanie dla list produktów

### 3. Ustawienia cenowe:
- **Cena regularna**: Standardowa cena produktu
- **Cena promocyjna**: Opcjonalna obniżona cena
- **Cena zakupu**: Koszt produktu (do kalkulacji marży)

### 4. Zarządzanie zapasami:
- **SKU**: Unikalny kod produktu
- **Śledzenie ilości**: Włącz/wyłącz śledzenie magazynowe
- **Ilość w magazynie**: Aktualna liczba sztuk
- **Próg niskiego stanu**: Poziom, przy którym system wysyła ostrzeżenie

### 5. Zdjęcia produktu:
- **Zdjęcie główne**: Główne zdjęcie produktu
- **Galeria**: Dodatkowe zdjęcia pokazujące produkt z różnych stron
- **Przeciągnij i upuść**: Łatwe przesyłanie wielu zdjęć jednocześnie

### 6. Warianty produktu:
- **Rozmiary**: S, M, L, XL, itd.
- **Kolory**: Różne opcje kolorystyczne
- **Materiały**: Rodzaje materiałów

### 7. SEO:
- **Tytuł meta**: Tytuł dla wyszukiwarek
- **Opis meta**: Opis dla wyników wyszukiwania
- **Słowo kluczowe**: Główne słowo kluczowe produktu

## Edycja produktów:
1. Znajdź produkt na liście
2. Kliknij ikonę edycji
3. Wprowadź zmiany
4. Kliknij "Zapisz"

## Status produktu:
- **Opublikowany**: Widoczny dla klientów
- **Szkic**: Niewidoczny, w przygotowaniu
- **Zarchiwizowany**: Niewidoczny, historyczny

## Akcje masowe:
- Zaznacz wiele produktów
- Zmień status wszystkich naraz
- Usuń wybrane produkty
- Eksportuj dane
        `,
        category: 'products',
        tags: ['products', 'inventory', 'catalog', 'adding', 'editing'],
        lastUpdated: new Date().toISOString(),
        relatedTopics: ['inventory-management', 'product-seo'],
        priority: 1,
        route: '/admin/products'
      },

      // Orders / Zamówienia
      {
        id: 'orders-management',
        title: 'Zarządzanie zamówieniami',
        description: 'Jak przetwarzać, aktualizować i zarządzać zamówieniami klientów',
        content: `
# Zarządzanie zamówieniami

Sekcja zamówień to miejsce, gdzie przetwarzasz wszystkie zamówienia od klientów.

## Status zamówień:

### 1. Oczekuje (Pending)
- Nowe zamówienie, wymaga sprawdzenia
- Często czeka na potwierdzenie płatności

### 2. Przetwarzanie (Processing) 
- Zamówienie zostało potwierdzone
- Produkty są przygotowywane do wysyłki

### 3. Wysłane (Shipped)
- Zamówienie zostało przekazane do przewoźnika
- Klient otrzymał numer śledzenia

### 4. Dostarczone (Delivered)
- Zamówienie dotarło do klienta
- Transakcja zakończona pomyślnie

### 5. Anulowane (Cancelled)
- Zamówienie zostało anulowane
- Może wymagać zwrotu pieniędzy

### 6. Zwrócone (Refunded)
- Pieniądze zostały zwrócone klientowi

## Przetwarzanie zamówienia:

### 1. Kliknij na zamówienie, aby zobaczyć szczegóły
### 2. Sprawdź:
- Dane klienta
- Adres dostawy
- Zamówione produkty
- Status płatności

### 3. Aktualizuj status:
- Wybierz nowy status z listy
- Dodaj notatkę (opcjonalne)
- Wyślij powiadomienie do klienta

### 4. Dodawanie informacji o wysyłce:
- Numer śledzenia
- Przewoźnik
- Szacowana data dostawy

## Notatki do zamówienia:
- **Notatka wewnętrzna**: Widoczna tylko dla administratorów
- **Notatka dla klienta**: Wysyłana w powiadomieniu email

## Akcje masowe:
- Zaznacz wiele zamówień
- Zmień status wszystkich naraz
- Wyeksportuj dane
- Wydrukuj etykiety wysyłkowe

## Filtry:
- Status zamówienia
- Zakres dat
- Klient
- Kwota zamówienia
        `,
        category: 'orders',
        tags: ['orders', 'processing', 'status', 'shipping', 'customers'],
        lastUpdated: new Date().toISOString(),
        relatedTopics: ['shipping-management', 'customer-communication'],
        priority: 1,
        route: '/admin/orders'
      },

      // Returns / Zwroty
      {
        id: 'returns-management',
        title: 'Zarządzanie zwrotami',
        description: 'Jak obsługiwać zwroty produktów i prośby o refundację',
        content: `
# Zarządzanie zwrotami

System zwrotów pozwala na profesjonalne obsługiwanie próśb klientów o zwrot produktów.

## Proces zwrotu:

### 1. Klient składa wniosek o zwrot
- Wybiera zamówienie
- Wskazuje produkty do zwrotu
- Podaje powód zwrotu
- Przesyła zdjęcia (jeśli wymagane)

### 2. Administrator otrzymuje powiadomienie
- Email z informacją o nowym zwrocie
- Powiadomienie w panelu administracyjnym

### 3. Sprawdzenie wniosku:
- Przejrzyj szczegóły zwrotu
- Sprawdź powód zwrotu
- Oceń stan produktów (na podstawie zdjęć)
- Sprawdź politykę zwrotów

### 4. Podjęcie decyzji:
- **Zaakceptuj**: Jeśli zwrot jest uzasadniony
- **Odrzuć**: Jeśli zwrot nie spełnia warunków
- **Wymagaj dodatkowych informacji**

## Status zwrotów:

### Oczekuje (Pending)
- Nowy wniosek, wymaga sprawdzenia

### Zaakceptowany (Approved)
- Zwrot został zaakceptowany
- Instrukcje wysłane do klienta

### W trakcie (In Progress)
- Produkt w drodze powrotnej
- Lub już otrzymany, w trakcie sprawdzania

### Zakończony (Completed)
- Produkt sprawdzony i zaakceptowany
- Refundacja przetworzona

### Odrzucony (Rejected)
- Zwrot nie spełnia warunków
- Klient powiadomiony o przyczynie

## Automatyczne reguły:
- Automatyczne akceptowanie zwrotów w określonym czasie
- Automatyczne odrzucanie po przekroczeniu terminu
- Różne reguły dla różnych kategorii produktów

## Refundacje:
- Pełna refundacja
- Częściowa refundacja
- Zwrot na kartę płatniczą
- Zwrot w formie kredytu sklepowego
        `,
        category: 'orders',
        tags: ['returns', 'refunds', 'customer-service'],
        lastUpdated: new Date().toISOString(),
        relatedTopics: ['orders-management', 'customer-support'],
        priority: 2,
        route: '/admin/returns'
      },

      // Analytics
      {
        id: 'analytics-reports',
        title: 'Raporty analityczne',
        description: 'Interpretacja danych analitycznych i generowanie raportów',
        content: `
# Raporty analityczne

Sekcja analityki dostarcza szczegółowych informacji o wydajności Twojego sklepu.

## Główne wskaźniki:

### Przychody:
- **Dzienne przychody**: Trend przychodów dzień po dniu
- **Porównanie okresów**: Zestawienie z poprzednimi okresami
- **Sezonowość**: Wzorce sprzedażowe w różnych porach roku

### Produkty:
- **Bestsellery**: Najchętniej kupowane produkty
- **Produkty o niskich obrotach**: Produkty wymagające promocji
- **Kategorie**: Wydajność poszczególnych kategorii

### Klienci:
- **Nowi vs powracający**: Analiza lojalności klientów
- **Wartość życiowa klienta (CLV)**: Średnia wartość klienta
- **Segmentacja**: Grupy klientów według zachowań

### Ruch na stronie:
- **Źródła ruchu**: Skąd przychodzą odwiedzający
- **Ścieżki konwersji**: Jak klienci poruszają się po stronie
- **Porzucone koszyki**: Analiza niezakończonych transakcji

## Tworzenie raportów:

### 1. Wybierz typ raportu:
- Raport sprzedaży
- Raport produktów
- Raport klientów
- Raport ruchu

### 2. Ustaw parametry:
- Zakres dat
- Filtry (kategorie, klienci, produkty)
- Metody grupowania danych

### 3. Generuj raport:
- Podgląd w przeglądarce
- Eksport do PDF
- Eksport do Excel
- Automatyczne wysyłanie email

## Automatyczne raporty:
- Dzienny raport sprzedaży
- Tygodniowy przegląd wydajności
- Miesięczne podsumowanie
- Alerty o nietypowych wydarzeniach

## Personalizacja:
- Własne dashboardy
- Ulubione wskaźniki
- Niestandardowe wykresy
- Integracja z zewnętrznymi narzędziami
        `,
        category: 'analytics',
        tags: ['analytics', 'reports', 'metrics', 'performance'],
        lastUpdated: new Date().toISOString(),
        relatedTopics: ['dashboard-overview', 'revenue-tracking'],
        priority: 2,
        route: '/admin/analytics'
      }
    ];

    topics.forEach(topic => {
      this.helpTopics.set(topic.id, topic);
    });
  }

  // Auto-detect and register new routes
  public registerRoute(route: string, title: string, description: string, category: string): void {
    const topicId = this.generateTopicId(route);
    
    if (!this.helpTopics.has(topicId)) {
      const newTopic: HelpTopic = {
        id: topicId,
        title: title,
        description: description,
        content: this.generateContentFromRoute(route, title, description),
        category: category,
        tags: [category, 'auto-generated'],
        lastUpdated: new Date().toISOString(),
        relatedTopics: [],
        priority: 3,
        route: route
      };
      
      this.helpTopics.set(topicId, newTopic);
    }
  }

  private generateTopicId(route: string): string {
    return route.replace(/^\/admin\//, '').replace(/\//g, '-') || 'dashboard';
  }

  private generateContentFromRoute(route: string, title: string, description: string): string {
    return `
# ${title}

${description}

## Funkcje dostępne w tej sekcji:

Ta strona została automatycznie wykryta przez system pomocy. Szczegółowa dokumentacja zostanie dodana wkrótce.

### Podstawowe operacje:
- Przeglądanie danych
- Dodawanie nowych elementów  
- Edycja istniejących elementów
- Usuwanie elementów
- Filtrowanie i wyszukiwanie
- Eksport danych

### Wskazówki:
1. Użyj funkcji wyszukiwania, aby szybko znaleźć potrzebne informacje
2. Skorzystaj z filtrów, aby wyświetlić tylko interesujące Cię dane
3. Regularnie eksportuj dane jako kopię zapasową
4. W razie problemów skontaktuj się z pomocą techniczną

**Uwaga**: Ta dokumentacja została wygenerowana automatycznie. Dla bardziej szczegółowych informacji skontaktuj się z administratorem systemu.
    `;
  }

  public searchTopics(query: string, language: string = 'pl'): HelpTopic[] {
    const searchTerm = query.toLowerCase();
    const results: HelpTopic[] = [];

    this.helpTopics.forEach(topic => {
      const searchableText = `${topic.title} ${topic.description} ${topic.content} ${topic.tags.join(' ')}`.toLowerCase();
      
      if (searchableText.includes(searchTerm)) {
        results.push(topic);
      }
    });

    return results.sort((a, b) => b.priority - a.priority);
  }

  public getTopicsByCategory(categoryId: string): HelpTopic[] {
    const results: HelpTopic[] = [];
    
    this.helpTopics.forEach(topic => {
      if (topic.category === categoryId) {
        results.push(topic);
      }
    });

    return results.sort((a, b) => b.priority - a.priority);
  }

  public getTopic(id: string): HelpTopic | null {
    return this.helpTopics.get(id) || null;
  }

  public getAllTopics(): HelpTopic[] {
    return Array.from(this.helpTopics.values()).sort((a, b) => b.priority - a.priority);
  }

  public getAllCategories(): HelpCategory[] {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  public getCategory(id: string): HelpCategory | null {
    return this.categories.get(id) || null;
  }

  public getRelatedTopics(topicId: string): HelpTopic[] {
    const topic = this.getTopic(topicId);
    if (!topic) return [];

    const relatedTopics: HelpTopic[] = [];
    
    topic.relatedTopics.forEach(relatedId => {
      const relatedTopic = this.getTopic(relatedId);
      if (relatedTopic) {
        relatedTopics.push(relatedTopic);
      }
    });

    return relatedTopics;
  }

  public getPopularTopics(limit: number = 5): HelpTopic[] {
    // This would normally be based on view counts, but for now return high priority topics
    return Array.from(this.helpTopics.values())
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }

  public getRecentlyUpdatedTopics(limit: number = 5): HelpTopic[] {
    return Array.from(this.helpTopics.values())
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, limit);
  }

  // Method to automatically scan and register admin routes
  public scanAdminRoutes(): void {
    // This would scan the file system in a real implementation
    // For now, we'll register some common routes that might exist
    const commonRoutes = [
      { route: '/admin/users', title: 'Zarządzanie użytkownikami', description: 'Zarządzanie kontami użytkowników systemu', category: 'settings' },
      { route: '/admin/settings', title: 'Ustawienia systemu', description: 'Konfiguracja globalnych ustawień sklepu', category: 'settings' },
      { route: '/admin/discounts', title: 'Rabaty i promocje', description: 'Tworzenie i zarządzanie kodami rabatowymi', category: 'marketing' },
      { route: '/admin/reviews', title: 'Recenzje produktów', description: 'Moderacja i zarządzanie recenzjami klientów', category: 'products' },
      { route: '/admin/notifications', title: 'Powiadomienia', description: 'Zarządzanie systemem powiadomień', category: 'settings' },
      { route: '/admin/invoices', title: 'Faktury', description: 'Generowanie i zarządzanie fakturami', category: 'orders' },
      { route: '/admin/support', title: 'Centrum wsparcia', description: 'System obsługi klienta i ticketów', category: 'troubleshooting' },
      { route: '/admin/security', title: 'Bezpieczeństwo', description: 'Ustawienia bezpieczeństwa i audyt systemu', category: 'settings' }
    ];

    commonRoutes.forEach(({ route, title, description, category }) => {
      this.registerRoute(route, title, description, category);
    });
  }
}

export const adminHelpSystem = AdminHelpSystem.getInstance();