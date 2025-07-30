'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { getSupportedLanguages, getSupportedCurrencies, translations } from '@/lib/translations';
import { currencyManager } from '@/lib/currency-manager';
import { activityLogger } from '@/lib/activity-logger';

interface TranslationData {
  [key: string]: string;
}

interface UploadedFile {
  name: string;
  content: string;
  type: string;
}

export default function TranslationsPage() {
  const { t, language, changeLanguage } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedNamespace, setSelectedNamespace] = useState('common');
  const [translations, setTranslations] = useState<TranslationData>({});
  const [newTranslation, setNewTranslation] = useState({ key: '', value: '' });
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const supportedLanguages = getSupportedLanguages();
  const supportedCurrencies = getSupportedCurrencies();

  const namespaces = [
    { key: 'common', name: 'Common' },
    { key: 'navigation', name: 'Navigation' },
    { key: 'products', name: 'Products' },
    { key: 'cart', name: 'Cart & Checkout' },
    { key: 'auth', name: 'Authentication' },
    { key: 'admin', name: 'Admin Panel' },
    { key: 'forms', name: 'Forms' },
    { key: 'buttons', name: 'Buttons' },
    { key: 'errors', name: 'Error Messages' },
    { key: 'success', name: 'Success Messages' }
  ];

  const productCategories = [
    { key: 'women', name: 'Women' },
    { key: 'men', name: 'Men' },
    { key: 'accessories', name: 'Accessories' },
    { key: 'electronics', name: 'Electronics' },
    { key: 'lifestyle', name: 'Lifestyle' }
  ];

  useEffect(() => {
    loadTranslations();
  }, [selectedLanguage, selectedNamespace]);

  const loadTranslations = () => {
    try {
      const stored = localStorage.getItem(`translations-${selectedLanguage}-${selectedNamespace}`);
      if (stored) {
        setTranslations(JSON.parse(stored));
      } else {
        setTranslations(getDefaultTranslations());
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      setTranslations(getDefaultTranslations());
    }
  };

  const getDefaultTranslations = () => {
    const defaults = {
      common: {
        'welcome': 'Welcome',
        'loading': 'Loading...',
        'error': 'An error occurred',
        'success': 'Success',
        'save': 'Save',
        'cancel': 'Cancel',
        'delete': 'Delete',
        'edit': 'Edit',
        'create': 'Create',
        'update': 'Update',
        'search': 'Search',
        'filter': 'Filter',
        'sort': 'Sort',
        'clear': 'Clear',
        'apply': 'Apply',
        'reset': 'Reset',
        'close': 'Close',
        'open': 'Open',
        'show': 'Show',
        'hide': 'Hide',
        'more': 'More',
        'less': 'Less',
        'all': 'All',
        'none': 'None',
        'yes': 'Yes',
        'no': 'No',
        'ok': 'OK',
        'confirm': 'Confirm',
        'back': 'Back',
        'next': 'Next',
        'previous': 'Previous',
        'finish': 'Finish',
        'language': 'Language',
        'currency': 'Currency'
      },
      navigation: {
        'home': 'Home',
        'products': 'Products',
        'categories': 'Categories',
        'women': 'Women',
        'men': 'Men',
        'accessories': 'Accessories',
        'sale': 'Sale',
        'about': 'About',
        'contact': 'Contact',
        'help': 'Help',
        'account': 'Account',
        'login': 'Login',
        'register': 'Register',
        'logout': 'Logout',
        'cart': 'Cart',
        'favorites': 'Favorites',
        'profile': 'Profile',
        'orders': 'Orders',
        'settings': 'Settings'
      },
      products: {
        'product': 'Product',
        'products': 'Products',
        'price': 'Price',
        'originalPrice': 'Original Price',
        'discount': 'Discount',
        'inStock': 'In Stock',
        'outOfStock': 'Out of Stock',
        'lowStock': 'Low Stock',
        'addToCart': 'Add to Cart',
        'buyNow': 'Buy Now',
        'quickView': 'Quick View',
        'details': 'Details',
        'description': 'Description',
        'specifications': 'Specifications',
        'features': 'Features',
        'reviews': 'Reviews',
        'rating': 'Rating',
        'size': 'Size',
        'color': 'Color',
        'quantity': 'Quantity',
        'availability': 'Availability',
        'sku': 'SKU',
        'brand': 'Brand',
        'category': 'Category',
        'tags': 'Tags',
        'related': 'Related Products',
        'recommended': 'Recommended',
        'bestseller': 'Bestseller',
        'newArrival': 'New Arrival',
        'onSale': 'On Sale',
        'featured': 'Featured'
      },
      cart: {
        'cart': 'Cart',
        'shoppingCart': 'Shopping Cart',
        'addToCart': 'Add to Cart',
        'removeFromCart': 'Remove from Cart',
        'updateCart': 'Update Cart',
        'cartEmpty': 'Your cart is empty',
        'cartTotal': 'Cart Total',
        'subtotal': 'Subtotal',
        'shipping': 'Shipping',
        'tax': 'Tax',
        'total': 'Total',
        'checkout': 'Checkout',
        'continueShopping': 'Continue Shopping',
        'proceedToCheckout': 'Proceed to Checkout',
        'quantity': 'Quantity',
        'remove': 'Remove',
        'update': 'Update',
        'coupon': 'Coupon',
        'applyCoupon': 'Apply Coupon',
        'discount': 'Discount',
        'freeShipping': 'Free Shipping',
        'estimatedDelivery': 'Estimated Delivery',
        'orderSummary': 'Order Summary'
      },
      auth: {
        'login': 'Login',
        'register': 'Register',
        'logout': 'Logout',
        'signIn': 'Sign In',
        'signUp': 'Sign Up',
        'signOut': 'Sign Out',
        'email': 'Email',
        'password': 'Password',
        'confirmPassword': 'Confirm Password',
        'forgotPassword': 'Forgot Password?',
        'resetPassword': 'Reset Password',
        'rememberMe': 'Remember Me',
        'createAccount': 'Create Account',
        'alreadyHaveAccount': 'Already have an account?',
        'dontHaveAccount': 'Don\'t have an account?',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'phoneNumber': 'Phone Number',
        'dateOfBirth': 'Date of Birth',
        'gender': 'Gender',
        'agreeToTerms': 'I agree to the Terms of Service',
        'subscribeNewsletter': 'Subscribe to newsletter'
      },
      admin: {
        'dashboard': 'Dashboard',
        'analytics': 'Analytics',
        'products': 'Products',
        'orders': 'Orders',
        'customers': 'Customers',
        'inventory': 'Inventory',
        'reports': 'Reports',
        'settings': 'Settings',
        'users': 'Users',
        'roles': 'Roles',
        'permissions': 'Permissions',
        'addProduct': 'Add Product',
        'editProduct': 'Edit Product',
        'deleteProduct': 'Delete Product',
        'viewOrders': 'View Orders',
        'processOrder': 'Process Order',
        'shipOrder': 'Ship Order',
        'refundOrder': 'Refund Order',
        'customerDetails': 'Customer Details',
        'orderHistory': 'Order History',
        'salesReport': 'Sales Report',
        'inventoryReport': 'Inventory Report',
        'lowStockAlert': 'Low Stock Alert',
        'outOfStockAlert': 'Out of Stock Alert'
      },
      forms: {
        'required': 'Required',
        'optional': 'Optional',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'fullName': 'Full Name',
        'email': 'Email',
        'emailAddress': 'Email Address',
        'phone': 'Phone',
        'phoneNumber': 'Phone Number',
        'address': 'Address',
        'streetAddress': 'Street Address',
        'city': 'City',
        'state': 'State',
        'zipCode': 'ZIP Code',
        'postalCode': 'Postal Code',
        'country': 'Country',
        'company': 'Company',
        'jobTitle': 'Job Title',
        'website': 'Website',
        'message': 'Message',
        'subject': 'Subject',
        'comment': 'Comment',
        'feedback': 'Feedback',
        'selectOption': 'Select an option',
        'chooseFile': 'Choose File',
        'uploadFile': 'Upload File',
        'dragDropFile': 'Drag and drop file here'
      },
      buttons: {
        'save': 'Save',
        'cancel': 'Cancel',
        'delete': 'Delete',
        'edit': 'Edit',
        'create': 'Create',
        'update': 'Update',
        'submit': 'Submit',
        'send': 'Send',
        'apply': 'Apply',
        'reset': 'Reset',
        'clear': 'Clear',
        'search': 'Search',
        'filter': 'Filter',
        'sort': 'Sort',
        'export': 'Export',
        'import': 'Import',
        'download': 'Download',
        'upload': 'Upload',
        'print': 'Print',
        'share': 'Share',
        'copy': 'Copy',
        'paste': 'Paste',
        'cut': 'Cut',
        'undo': 'Undo',
        'redo': 'Redo',
        'refresh': 'Refresh',
        'reload': 'Reload',
        'loading': 'Loading...',
        'saving': 'Saving...',
        'processing': 'Processing...',
        'sending': 'Sending...'
      },
      errors: {
        'generalError': 'An error occurred. Please try again.',
        'networkError': 'Network error. Please check your connection.',
        'validationError': 'Please check your input and try again.',
        'authError': 'Authentication failed. Please log in again.',
        'permissionError': 'You don\'t have permission to perform this action.',
        'notFound': 'The requested resource was not found.',
        'serverError': 'Server error. Please try again later.',
        'timeoutError': 'Request timeout. Please try again.',
        'fileUploadError': 'File upload failed. Please try again.',
        'fileSizeError': 'File size is too large.',
        'fileTypeError': 'File type is not supported.',
        'requiredField': 'This field is required.',
        'invalidEmail': 'Please enter a valid email address.',
        'invalidPhone': 'Please enter a valid phone number.',
        'invalidUrl': 'Please enter a valid URL.',
        'passwordMismatch': 'Passwords do not match.',
        'passwordTooShort': 'Password is too short.',
        'passwordTooWeak': 'Password is too weak.',
        'emailExists': 'An account with this email already exists.',
        'userNotFound': 'User not found.',
        'invalidCredentials': 'Invalid email or password.',
        'accountDisabled': 'Your account has been disabled.',
        'accountNotVerified': 'Please verify your email address.',
        'tooManyAttempts': 'Too many failed attempts. Please try again later.',
        'sessionExpired': 'Your session has expired. Please log in again.',
        'cartEmpty': 'Your cart is empty.',
        'itemOutOfStock': 'This item is out of stock.',
        'itemNotAvailable': 'This item is not available.',
        'invalidQuantity': 'Invalid quantity.',
        'shippingNotAvailable': 'Shipping is not available to your location.',
        'paymentFailed': 'Payment failed. Please try again.',
        'couponInvalid': 'Invalid coupon code.',
        'couponExpired': 'Coupon has expired.',
        'couponUsed': 'Coupon has already been used.',
        'orderNotFound': 'Order not found.',
        'orderCancelled': 'Order has been cancelled.',
        'refundFailed': 'Refund failed. Please contact support.'
      },
      success: {
        'saved': 'Saved successfully',
        'updated': 'Updated successfully',
        'deleted': 'Deleted successfully',
        'created': 'Created successfully',
        'sent': 'Sent successfully',
        'uploaded': 'Uploaded successfully',
        'downloaded': 'Downloaded successfully',
        'copied': 'Copied to clipboard',
        'accountCreated': 'Account created successfully',
        'loginSuccess': 'Logged in successfully',
        'logoutSuccess': 'Logged out successfully',
        'passwordChanged': 'Password changed successfully',
        'passwordReset': 'Password reset email sent',
        'emailVerified': 'Email verified successfully',
        'profileUpdated': 'Profile updated successfully',
        'settingsSaved': 'Settings saved successfully',
        'productAdded': 'Product added to cart',
        'productRemoved': 'Product removed from cart',
        'cartUpdated': 'Cart updated successfully',
        'orderPlaced': 'Order placed successfully',
        'orderCancelled': 'Order cancelled successfully',
        'orderShipped': 'Order shipped successfully',
        'orderDelivered': 'Order delivered successfully',
        'paymentSuccess': 'Payment processed successfully',
        'refundProcessed': 'Refund processed successfully',
        'couponApplied': 'Coupon applied successfully',
        'subscribed': 'Subscribed to newsletter successfully',
        'unsubscribed': 'Unsubscribed successfully',
        'feedbackSent': 'Feedback sent successfully',
        'reviewSubmitted': 'Review submitted successfully',
        'wishlistUpdated': 'Wishlist updated successfully',
        'addressSaved': 'Address saved successfully',
        'preferencesUpdated': 'Preferences updated successfully'
      }
    };

    return defaults[selectedNamespace] || {};
  };

  const handleSaveTranslation = (key: string, value: string) => {
    if (!key || !value) return;

    const updatedTranslations = {
      ...translations,
      [key]: value
    };

    setTranslations(updatedTranslations);
    setIsDirty(true);

    // Save to localStorage
    localStorage.setItem(
      `translations-${selectedLanguage}-${selectedNamespace}`,
      JSON.stringify(updatedTranslations)
    );

    // Log the activity
    activityLogger.log(
      'Translation Updated',
      'translation',
      `Translation key "${key}" updated for ${selectedLanguage}`,
      {
        resourceId: `${selectedLanguage}-${selectedNamespace}-${key}`,
        resourceType: 'translation',
        changes: { key, value, language: selectedLanguage, namespace: selectedNamespace },
        severity: 'info'
      }
    );
  };

  const handleAddTranslation = () => {
    if (!newTranslation.key || !newTranslation.value) return;

    handleSaveTranslation(newTranslation.key, newTranslation.value);
    setNewTranslation({ key: '', value: '' });
  };

  const handleDeleteTranslation = (key: string) => {
    if (confirm(`Are you sure you want to delete the translation for "${key}"?`)) {
      const updatedTranslations = { ...translations };
      delete updatedTranslations[key];
      setTranslations(updatedTranslations);
      setIsDirty(true);

      localStorage.setItem(
        `translations-${selectedLanguage}-${selectedNamespace}`,
        JSON.stringify(updatedTranslations)
      );

      activityLogger.log(
        'Translation Deleted',
        'translation',
        `Translation key "${key}" deleted for ${selectedLanguage}`,
        {
          resourceId: `${selectedLanguage}-${selectedNamespace}-${key}`,
          resourceType: 'translation',
          changes: { key, deleted: true, language: selectedLanguage, namespace: selectedNamespace },
          severity: 'info'
        }
      );
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      alert('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploadedTranslations = JSON.parse(e.target.result);
        setTranslations(uploadedTranslations);
        setIsDirty(true);

        localStorage.setItem(
          `translations-${selectedLanguage}-${selectedNamespace}`,
          JSON.stringify(uploadedTranslations)
        );

        activityLogger.log(
          'Translation File Uploaded',
          'translation',
          `Translation file uploaded for ${selectedLanguage}-${selectedNamespace}`,
          {
            resourceId: `${selectedLanguage}-${selectedNamespace}`,
            resourceType: 'translation',
            changes: { fileName: file.name, language: selectedLanguage, namespace: selectedNamespace },
            severity: 'info'
          }
        );

        alert('Translation file uploaded successfully!');
      } catch (error) {
        alert('Error parsing JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportTranslations = () => {
    const dataStr = JSON.stringify(translations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `translations-${selectedLanguage}-${selectedNamespace}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    activityLogger.log(
      'Translation File Exported',
      'translation',
      `Translation file exported for ${selectedLanguage}-${selectedNamespace}`,
      {
        resourceId: `${selectedLanguage}-${selectedNamespace}`,
        resourceType: 'translation',
        changes: { exported: true, language: selectedLanguage, namespace: selectedNamespace },
        severity: 'info'
      }
    );
  };

  const handleProductTranslation = (productId: string, field: string, value: string) => {
    const key = `product.${productId}.${field}`;
    handleSaveTranslation(key, value);
  };

  const handleCategoryTranslation = (categoryId: string, value: string) => {
    const key = `category.${categoryId}`;
    handleSaveTranslation(key, value);
  };

  const filteredTranslations = Object.entries(translations).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTranslationCount = () => {
    return Object.keys(translations).length;
  };

  const getTranslationProgress = () => {
    const englishTranslations = getDefaultTranslations();
    const englishCount = Object.keys(englishTranslations).length;
    const currentCount = Object.keys(translations).length;
    return englishCount > 0 ? Math.round((currentCount / englishCount) * 100) : 0;
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
              <h1 className="text-2xl font-bold text-gray-900">Translation Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {getTranslationCount()} translations • {getTranslationProgress()}% complete
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language and Namespace Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Namespace</label>
              <select
                value={selectedNamespace}
                onChange={(e) => setSelectedNamespace(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {namespaces.map(namespace => (
                  <option key={namespace.key} value={namespace.key}>
                    {namespace.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getTranslationProgress()}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                {getTranslationProgress()}%
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <i className="ri-upload-line mr-2"></i>
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportTranslations}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="ri-download-line mr-2"></i>
                Export JSON
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {isDirty && (
                <div className="flex items-center text-orange-600 text-sm">
                  <i className="ri-information-line mr-1"></i>
                  Unsaved changes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add New Translation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Translation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
              <input
                type="text"
                value={newTranslation.key}
                onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
                placeholder="e.g., welcome.title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
              <div className="flex">
                <input
                  type="text"
                  value={newTranslation.value}
                  onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
                  placeholder="Translation value"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAddTranslation}
                  className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Translations */}
        {selectedNamespace === 'products' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Translations</h3>
            <div className="space-y-4">
              {productCategories.map(category => (
                <div key={category.key} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{category.name} Category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                      <input
                        type="text"
                        placeholder={`${category.name} in ${selectedLanguage}`}
                        onChange={(e) => handleCategoryTranslation(category.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        placeholder={`${category.name} description in ${selectedLanguage}`}
                        onChange={(e) => handleCategoryTranslation(`${category.key}.description`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency for {selectedLanguage.toUpperCase()}</label>
              <select
                value={currencyManager.getCurrentCurrency()}
                onChange={(e) => currencyManager.setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {supportedCurrencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rate Update</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Simulate exchange rate update
                    alert('Exchange rates updated successfully!');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Update Rates
                </button>
                <span className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Translation List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedNamespace} Translations ({filteredTranslations.length})
            </h3>
          </div>
          <div className="p-6">
            {filteredTranslations.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-translate-2 text-4xl text-gray-400 mb-4"></i>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No translations found</h4>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search term.' : 'Add your first translation above.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTranslations.map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
                        <input
                          type="text"
                          value={key}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                        <div className="flex">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleSaveTranslation(key, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleDeleteTranslation(key)}
                            className="bg-red-600 text-white px-3 py-2 rounded-r-lg hover:bg-red-700 transition-colors"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}