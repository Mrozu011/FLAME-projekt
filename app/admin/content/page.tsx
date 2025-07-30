
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContentManagement() {
  const [sliderItems, setSliderItems] = useState([]);
  const [activeTab, setActiveTab] = useState('slider');
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [uploadType, setUploadType] = useState('image');
  const [editingSlider, setEditingSlider] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [sliderForm, setSliderForm] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    imageUrl: '',
    videoUrl: '',
    type: 'image',
    textOverlay: {
      enabled: false,
      text: '',
      position: 'center',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    active: true,
    order: 0
  });

  const [contentForm, setContentForm] = useState({
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: ''
  });

  const [pagesContent, setPagesContent] = useState([
    {
      id: 'about',
      title: 'About Us Page',
      description: 'Manage your about us page content and company information',
      content: `# About Flame

Welcome to Flame, your premier destination for fashion, electronics, and lifestyle products. Since our founding in 2020, we've been dedicated to bringing you the latest trends and highest quality products at competitive prices.

## Our Mission
To provide exceptional shopping experiences through carefully curated products, outstanding customer service, and innovative e-commerce solutions.

## Our Values
- **Quality First**: We source only the best products from trusted suppliers
- **Customer Focus**: Your satisfaction is our top priority
- **Innovation**: We continuously improve our platform and services
- **Sustainability**: We're committed to environmentally responsible practices

## Our Team
Our dedicated team of 50+ professionals works around the clock to ensure your shopping experience is seamless and enjoyable.

## Contact Information
- **Phone**: +1 (555) 123-4567
- **Email**: info@flame.com
- **Address**: 123 Commerce Street, New York, NY 10001`,
      metaTitle: 'About Us - Flame E-commerce Store',
      metaDescription: 'Learn about Flame\'s mission, values, and commitment to providing premium products and exceptional customer service.'
    },
    {
      id: 'contact',
      title: 'Contact Page',
      description: 'Update contact information and office locations',
      content: `# Contact Us

We'd love to hear from you! Get in touch with our customer service team for any questions or concerns.

## Customer Service Hours
- **Monday - Friday**: 9:00 AM - 8:00 PM EST
- **Saturday**: 10:00 AM - 6:00 PM EST  
- **Sunday**: 12:00 PM - 5:00 PM EST

## Contact Information
- **Phone**: +1 (555) 123-4567
- **Email**: support@flame.com
- **Live Chat**: Available on our website during business hours

## Office Locations

### Headquarters
**Address**: 123 Commerce Street, New York, NY 10001
**Phone**: +1 (555) 123-4567

### West Coast Office  
**Address**: 456 Innovation Drive, San Francisco, CA 94105
**Phone**: +1 (555) 987-6543

### Customer Support Center
**Address**: 789 Service Boulevard, Austin, TX 78701
**Phone**: +1 (555) 456-7890

## Frequently Asked Questions
For quick answers to common questions, please visit our FAQ page.

## Returns & Exchanges
Need to return or exchange an item? Visit our Returns page for detailed instructions.`,
      metaTitle: 'Contact Us - Flame Customer Support',
      metaDescription: 'Get in touch with Flame customer service. Find our contact information, office locations, and support hours.'
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      description: 'Update legal terms and conditions',
      content: `# Terms and Conditions

**Last Updated**: January 1, 2024

Welcome to Flame. These terms and conditions outline the rules and regulations for the use of Flame's Website.

## 1. Acceptance of Terms
By accessing this website, we assume you accept these terms and conditions. Do not continue to use Flame if you do not agree to take all of the terms and conditions stated on this page.

## 2. Use License
Permission is granted to temporarily download one copy of the materials on Flame's website for personal, non-commercial transitory viewing only.

### This license shall automatically terminate if you violate any of these restrictions:
- Modify or copy the materials
- Use the materials for any commercial purpose or for any public display
- Attempt to reverse engineer any software contained on the website
- Remove any copyright or other proprietary notations from the materials

## 3. Disclaimer
The materials on Flame's website are provided on an 'as is' basis. Flame makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 4. Limitations
In no event shall Flame or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Flame's website.

## 5. Privacy Policy
Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website.

## 6. Governing Law
These terms and conditions are governed by and construed in accordance with the laws of New York and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.

## Contact Information
If you have any questions about these Terms and Conditions, please contact us at legal@flame.com.`,
      metaTitle: 'Terms and Conditions - Flame E-commerce',
      metaDescription: 'Read Flame\'s terms and conditions for using our e-commerce website and services.'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'Manage privacy policy and data protection information',
      content: `# Privacy Policy

**Effective Date**: January 1, 2024

Flame ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

## 1. Information We Collect

### Personal Information
- Name, email address, phone number
- Billing and shipping addresses
- Payment information (processed securely)
- Account credentials

### Automatic Information
- IP address, browser type, operating system
- Pages visited, time spent on pages
- Referring website addresses
- Cookies and similar technologies

## 2. How We Use Your Information
We use the information we collect to:
- Process and fulfill orders
- Communicate with you about your account or orders
- Improve our website and services
- Send promotional emails (with your consent)
- Comply with legal obligations

## 3. Information Sharing
We do not sell, trade, or rent your personal information to third parties. We may share information with:
- Service providers who assist with our operations
- Legal authorities when required by law
- Business partners for joint promotions (with your consent)

## 4. Data Security
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## 5. Cookies
We use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect website functionality.

## 6. Your Rights
You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications
- Port your data to another service

## 7. Children's Privacy
Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.

## 8. Changes to Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

## Contact Us
If you have questions about this Privacy Policy, please contact us at privacy@flame.com.`,
      metaTitle: 'Privacy Policy - Flame Data Protection',
      metaDescription: 'Learn how Flame collects, uses, and protects your personal information. Read our comprehensive privacy policy.'
    }
  ]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const [seoForm, setSeoForm] = useState({
    siteTitle: 'Flame - Premium E-commerce Store',
    metaDescription: 'Discover premium products at Flame. Shop the latest fashion, electronics, and lifestyle items with fast shipping and excellent customer service.',
    keywords: 'ecommerce, fashion, electronics, lifestyle, online shopping'
  });

  useEffect(() => {
    const mockSliderItems = [
      {
        id: 1,
        title: 'Summer Collection 2024',
        subtitle: 'Discover the latest trends in fashion',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        imageUrl: 'https://readdy.ai/api/search-image?query=modern%20fashion%20summer%20collection%20with%20vibrant%20colors%20and%20elegant%20styling%2C%20professional%20product%20photography%20with%20clean%20background%20and%20natural%20lighting%2C%20showcasing%20trendy%20clothing%20items%20in%20a%20minimalist%20setting&width=800&height=400&seq=slider1&orientation=landscape',
        type: 'image',
        textOverlay: { enabled: false, text: '', position: 'center', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' },
        active: true,
        order: 1
      },
      {
        id: 2,
        title: 'Tech Gadgets Sale',
        subtitle: 'Up to 50% off on electronics',
        buttonText: 'Explore Deals',
        buttonLink: '/electronics',
        imageUrl: 'https://readdy.ai/api/search-image?query=modern%20technology%20gadgets%20and%20electronics%20display%20with%20sleek%20design%2C%20professional%20product%20photography%20featuring%20smartphones%2C%20headphones%2C%20and%20smart%20devices%20arranged%20aesthetically%20with%20clean%20white%20background&width=800&height=400&seq=slider2&orientation=landscape',
        type: 'image',
        textOverlay: { enabled: false, text: '', position: 'center', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' },
        active: true,
        order: 2
      },
      {
        id: 3,
        title: 'Lifestyle Essentials',
        subtitle: 'Elevate your daily routine',
        buttonText: 'Discover',
        buttonLink: '/lifestyle',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        type: 'video',
        textOverlay: { enabled: true, text: 'New Arrivals', position: 'bottom-left', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.7)' },
        active: false,
        order: 3
      }
    ];

    setSliderItems(mockSliderItems.sort((a, b) => a.order - b.order));
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = uploadType === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setSubmitStatus({ 
        type: 'error', 
        message: `File size exceeds ${uploadType === 'image' ? '5MB' : '50MB'} limit` 
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      formData.append('uploadType', 'slider');

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUrl = uploadType === 'image' 
        ? `https://readdy.ai/api/search-image?query=uploaded%20${file.name}%20professional%20photography%20with%20clean%20background%20and%20modern%20styling&width=800&height=400&seq=upload${Date.now()}&orientation=landscape`
        : URL.createObjectURL(file);

      setUploadProgress(100);
      
      setSliderForm(prev => ({
        ...prev,
        [uploadType === 'image' ? 'imageUrl' : 'videoUrl']: mockUrl,
        type: uploadType
      }));

      setSubmitStatus({ type: 'success', message: 'File uploaded successfully!' });
      setShowUploadModal(false);
      setShowSliderModal(true);
      
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...sliderItems];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    newItems.forEach((item, index) => {
      item.order = index + 1;
    });

    setSliderItems(newItems);
    setDraggedItem(null);
  };

  const moveSlideUp = (id) => {
    const currentIndex = sliderItems.findIndex(item => item.id === id);
    if (currentIndex > 0) {
      const newItems = [...sliderItems];
      [newItems[currentIndex], newItems[currentIndex - 1]] = [newItems[currentIndex - 1], newItems[currentIndex]];
      newItems.forEach((item, index) => {
        item.order = index + 1;
      });
      setSliderItems(newItems);
    }
  };

  const moveSlideDown = (id) => {
    const currentIndex = sliderItems.findIndex(item => item.id === id);
    if (currentIndex < sliderItems.length - 1) {
      const newItems = [...sliderItems];
      [newItems[currentIndex], newItems[currentIndex + 1]] = [newItems[currentIndex + 1], newItems[currentIndex]];
      newItems.forEach((item, index) => {
        item.order = index + 1;
      });
      setSliderItems(newItems);
    }
  };

  const handleSliderFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('textOverlay.')) {
      const overlayField = name.split('.').pop();
      setSliderForm(prev => ({
        ...prev,
        textOverlay: {
          ...prev.textOverlay,
          [overlayField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSliderForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSliderSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Submitting...' });

    if (!sliderForm.title || !sliderForm.subtitle || !sliderForm.buttonText || !sliderForm.buttonLink) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (sliderForm.type === 'image' && !sliderForm.imageUrl) {
      setSubmitStatus({ type: 'error', message: 'Please provide an image URL.' });
      return;
    }

    if (sliderForm.type === 'video' && !sliderForm.videoUrl) {
      setSubmitStatus({ type: 'error', message: 'Please provide a video URL.' });
      return;
    }

    if (sliderForm.subtitle.length > 500) {
      setSubmitStatus({ type: 'error', message: 'Subtitle cannot exceed 500 characters.' });
      return;
    }

    try {
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('title', sliderForm.title);
      formDataToSubmit.append('subtitle', sliderForm.subtitle);
      formDataToSubmit.append('buttonText', sliderForm.buttonText);
      formDataToSubmit.append('buttonLink', sliderForm.buttonLink);
      formDataToSubmit.append('imageUrl', sliderForm.imageUrl || '');
      formDataToSubmit.append('videoUrl', sliderForm.videoUrl || '');
      formDataToSubmit.append('type', sliderForm.type);

      formDataToSubmit.append('textOverlayEnabled', sliderForm.textOverlay.enabled ? 'true' : 'false');
      formDataToSubmit.append('textOverlayText', sliderForm.textOverlay.text || '');
      formDataToSubmit.append('textOverlayPosition', sliderForm.textOverlay.position || 'center');
      formDataToSubmit.append('textOverlayColor', sliderForm.textOverlay.color || '#ffffff');
      formDataToSubmit.append('textOverlayBackgroundColor', sliderForm.textOverlay.backgroundColor || 'rgba(0,0,0,0.5)');

      formDataToSubmit.append('active', sliderForm.active ? 'true' : 'false');
      formDataToSubmit.append('editMode', editingSlider ? 'true' : 'false');
      formDataToSubmit.append('formType', 'slider');

      if (editingSlider) {
        formDataToSubmit.append('sliderId', editingSlider.id.toString());
      }

      const response = await fetch('https://readdy.ai/api/form/d24787mb5t8jehpp9vsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString()
      });

      if (response.ok) {
        const responseData = await response.text();
        setSubmitStatus({ 
          type: 'success', 
          message: `Slider ${editingSlider ? 'updated' : 'created'} successfully! Response time: ${new Date().toLocaleTimeString}` 
        });

        if (editingSlider) {
          setSliderItems(sliderItems.map(item =>
            item.id === editingSlider.id
              ? { ...item, ...sliderForm }
              : item
          ));
        } else {
          const newItem = {
            id: Date.now(),
            ...sliderForm,
            order: sliderItems.length + 1
          };
          setSliderItems([...sliderItems, newItem]);
        }

        setTimeout(() => {
          setShowSliderModal(false);
          setEditingSlider(null);
          resetForm();
          setSubmitStatus({ type: '', message: '' });
        }, 2000);
      } else {
        const errorText = await response.text();
        setSubmitStatus({ 
          type: 'error', 
          message: `Failed to save slider: ${response.status} ${response.statusText}` 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: `Network error: ${error.message}. Please check your connection and try again.` 
      });
    }
  };

  const handleSeoFormChange = (e) => {
    const { name, value } = e.target;
    setSeoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Saving SEO settings...' });

    if (!seoForm.siteTitle || !seoForm.metaDescription || !seoForm.keywords) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (seoForm.metaDescription.length > 500) {
      setSubmitStatus({ type: 'error', message: 'Meta description cannot exceed 500 characters.' });
      return;
    }

    try {
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('siteTitle', seoForm.siteTitle);
      formDataToSubmit.append('metaDescription', seoForm.metaDescription);
      formDataToSubmit.append('keywords', seoForm.keywords);
      formDataToSubmit.append('formType', 'seo');

      const response = await fetch('https://readdy.ai/api/form/d24787mb5t8jehpp9vsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString()
      });

      if (response.ok) {
        const responseData = await response.text();
        setSubmitStatus({ 
          type: 'success', 
          message: `SEO settings saved successfully! Response time: ${new Date().toLocaleTimeString}` 
        });
        
        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 3000);
      } else {
        const errorText = await response.text();
        setSubmitStatus({ 
          type: 'error', 
          message: `Failed to save SEO settings: ${response.status} ${response.statusText}` 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: `Network error: ${error.message}. Please check your connection and try again.` 
      });
    }
  };

  const handleEditSlider = (item) => {
    setEditingSlider(item);
    setSliderForm({
      title: item.title,
      subtitle: item.subtitle,
      buttonText: item.buttonText,
      buttonLink: item.buttonLink,
      imageUrl: item.imageUrl || '',
      videoUrl: item.videoUrl || '',
      type: item.type || 'image',
      textOverlay: item.textOverlay || {
        enabled: false,
        text: '',
        position: 'center',
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      active: item.active,
      order: item.order
    });
    setShowSliderModal(true);
  };

  const handleDeleteSlider = (id) => {
    if (confirm('Are you sure you want to delete this slider item?')) {
      setSliderItems(sliderItems.filter(item => item.id !== id));
    }
  };

  const toggleSliderActive = (id) => {
    setSliderItems(sliderItems.map(item =>
      item.id === id
        ? { ...item, active: !item.active }
        : item
    ));
  };

  const openUploadModal = (type) => {
    setUploadType(type);
    setShowUploadModal(true);
    setSubmitStatus({ type: '', message: '' });
  };

  const resetForm = () => {
    setSliderForm({
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      imageUrl: '',
      videoUrl: '',
      type: 'image',
      textOverlay: {
        enabled: false,
        text: '',
        position: 'center',
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      active: true,
      order: 0
    });
  };

  const handleContentFormChange = (e) => {
    const { name, value } = e.target;
    setContentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: 'loading', message: 'Saving content...' });

    if (!contentForm.title || !contentForm.content) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (contentForm.content.length > 10000) {
      setSubmitStatus({ type: 'error', message: 'Content cannot exceed 10,000 characters.' });
      return;
    }

    try {
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('pageId', editingContent.id);
      formDataToSubmit.append('title', contentForm.title);
      formDataToSubmit.append('content', contentForm.content);
      formDataToSubmit.append('metaTitle', contentForm.metaTitle);
      formDataToSubmit.append('metaDescription', contentForm.metaDescription);
      formDataToSubmit.append('formType', 'pageContent');

      const response = await fetch('https://readdy.ai/api/form/d24787mb5t8jehpp9vsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSubmit.toString()
      });

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: `Page content updated successfully! Response time: ${new Date().toLocaleTimeString()}` 
        });

        setPagesContent(pagesContent.map(page =>
          page.id === editingContent.id
            ? { 
                ...page, 
                content: contentForm.content,
                metaTitle: contentForm.metaTitle,
                metaDescription: contentForm.metaDescription
              }
            : page
        ));

        setTimeout(() => {
          setShowContentModal(false);
          setEditingContent(null);
          setSubmitStatus({ type: '', message: '' });
        }, 2000);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: `Failed to save content: ${response.status} ${response.statusText}` 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: `Network error: ${error.message}. Please check your connection and try again.` 
      });
    }
  };

  const handleEditContent = (page) => {
    setEditingContent(page);
    setContentForm({
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription
    });
    setShowContentModal(true);
    setSubmitStatus({ type: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('slider')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'slider'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Slider Manager
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pages Content
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'seo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                SEO Settings
              </button>
            </nav>
          </div>

          {activeTab === 'slider' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Homepage Slider Manager</h2>
                  <p className="text-sm text-gray-600 mt-1">Upload and manage your homepage carousel content</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => openUploadModal('image')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center"
                  >
                    <i className="ri-image-add-line mr-2"></i>
                    Add Image to Slider
                  </button>
                  <button
                    onClick={() => openUploadModal('video')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center"
                  >
                    <i className="ri-video-add-line mr-2"></i>
                    Add Video to Slider
                  </button>
                  <button
                    onClick={() => setShowSliderModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Create Manual Slide
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Current Slides ({sliderItems.length})</h3>
                {sliderItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <i className="ri-image-line text-4xl mb-2"></i>
                    <p>No slides added yet. Click the buttons above to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sliderItems.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, item)}
                        className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-move ${
                          draggedItem?.id === item.id ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="aspect-w-16 aspect-h-9 relative">
                          {item.type === 'video' ? (
                            <video
                              src={item.videoUrl}
                              className="w-full h-32 object-cover"
                              muted
                              controls
                            />
                          ) : (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-32 object-cover"
                            />
                          )}
                          <div className="absolute top-2 left-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.type === 'video'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              <i
                                className={`ri-${item.type === 'video' ? 'video' : 'image'}-line mr-1`}
                              ></i>
                              {item.type}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-900 text-white rounded-full text-xs font-medium">
                              {index + 1}
                            </span>
                          </div>
                          {item.textOverlay?.enabled && (
                            <div
                              className={`absolute ${
                                item.textOverlay.position === 'top-left'
                                  ? 'top-2 left-2'
                                  : item.textOverlay.position === 'top-right'
                                  ? 'top-2 right-2'
                                  : item.textOverlay.position === 'bottom-left'
                                  ? 'bottom-2 left-2'
                                  : item.textOverlay.position === 'bottom-right'
                                  ? 'bottom-2 right-2'
                                  : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                              }`}
                            >
                              <div
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  color: item.textOverlay.color,
                                  backgroundColor: item.textOverlay.backgroundColor
                                }}
                              >
                                {item.textOverlay.text}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleSliderActive(item.id)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  item.active
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                                title={item.active ? 'Active' : 'Inactive'}
                              >
                                <i
                                  className={`ri-${item.active ? 'eye' : 'eye-off'}-line text-xs`}
                                ></i>
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 truncate">{item.subtitle}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => moveSlideUp(item.id)}
                                disabled={index === 0}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <i className="ri-arrow-up-line"></i>
                              </button>
                              <button
                                onClick={() => moveSlideDown(item.id)}
                                disabled={index === sliderItems.length - 1}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <i className="ri-arrow-down-line"></i>
                              </button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditSlider(item)}
                                className="text-blue-600 hover:text-blue-800 w-8 h-8 flex items-center justify-center"
                                title="Edit"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteSlider(item.id)}
                                className="text-red-600 hover:text-red-800 w-8 h-8 flex items-center justify-center"
                                title="Delete"
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="ri-information-line text-blue-600 mr-2"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Pro Tips:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Drag and drop slides to reorder them</li>
                      <li>Use the arrow buttons for precise positioning</li>
                      <li>Toggle the eye icon to activate/deactivate slides</li>
                      <li>Only active slides will appear on your homepage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Pages Content</h2>
              <div className="space-y-4">
                {pagesContent.map((page) => (
                  <div key={page.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{page.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                      </div>
                      <button 
                        onClick={() => handleEditContent(page)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <i className="ri-edit-line mr-1"></i>
                        Edit Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO Settings</h2>

              {submitStatus.message && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center ${submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : submitStatus.type === 'error'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-blue-50 text-blue-800'
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

              <form
                id="seo-settings-form"
                data-readdy-form
                onSubmit={handleSeoSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Title *
                  </label>
                  <input
                    type="text"
                    name="siteTitle"
                    value={seoForm.siteTitle}
                    onChange={handleSeoFormChange}
                    maxLength={60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{seoForm.siteTitle.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description *
                  </label>
                  <textarea
                    name="metaDescription"
                    value={seoForm.metaDescription}
                    onChange={handleSeoFormChange}
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoForm.metaDescription.length}/500 characters
                    {seoForm.metaDescription.length > 500 && (
                      <span className="text-red-500 ml-2">Character limit exceeded!</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords *
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={seoForm.keywords}
                    onChange={handleSeoFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Separate keywords with commas"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitStatus.type === 'loading' || seoForm.metaDescription.length > 500}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitStatus.type === 'loading' ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      Save SEO Settings
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload {uploadType === 'image' ? 'Image' : 'Video'} to Slider
            </h3>

            {submitStatus.message && (
              <div
                className={`mb-4 p-3 rounded-lg ${submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : submitStatus.type === 'error'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-blue-50 text-blue-800'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i
                  className={`ri-${uploadType === 'image' ? 'image' : 'video'}-line text-3xl text-gray-400 mb-2`}
                ></i>
                <p className="text-sm text-gray-600 mb-4">
                  {uploadType === 'image' ? 'Select an image file' : 'Select a video file'}
                </p>
                <input
                  type="file"
                  accept={uploadType === 'image' ? 'image/*' : 'video/mp4,video/webm'}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  <i className="ri-upload-line mr-2"></i>
                  Choose File
                </label>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>• {uploadType === 'image' ? 'Supported formats: JPG, PNG, GIF, WebP' : 'Supported formats: MP4, WebM'}</p>
                <p>• Maximum file size: {uploadType === 'image' ? '5MB' : '50MB'}</p>
                <p>• Recommended dimensions: 1920x1080 pixels</p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSubmitStatus({ type: '', message: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
                  disabled={isUploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSliderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSlider ? 'Edit Slide' : 'Create New Slide'}
            </h3>

            {submitStatus.message && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center ${submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : submitStatus.type === 'error'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-blue-50 text-blue-800'
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

            <form
              id="slider-form"
              data-readdy-form
              onSubmit={handleSliderSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media Type *</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="image"
                      checked={sliderForm.type === 'image'}
                      onChange={handleSliderFormChange}
                      className="mr-2"
                    />
                    <i className="ri-image-line mr-1"></i>
                    Image
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="video"
                      checked={sliderForm.type === 'video'}
                      onChange={handleSliderFormChange}
                      className="mr-2"
                    />
                    <i className="ri-video-line mr-1"></i>
                    Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {sliderForm.type === 'image' ? 'Image URL *' : 'Video URL *'}
                </label>
                <input
                  type="url"
                  name={sliderForm.type === 'image' ? 'imageUrl' : 'videoUrl'}
                  value={sliderForm.type === 'image' ? sliderForm.imageUrl : sliderForm.videoUrl}
                  onChange={handleSliderFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={sliderForm.title}
                    onChange={handleSliderFormChange}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle *</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={sliderForm.subtitle}
                    onChange={handleSliderFormChange}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {sliderForm.subtitle.length}/500 characters
                    {sliderForm.subtitle.length > 500 && (
                      <span className="text-red-500 ml-2">Character limit exceeded!</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text *</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={sliderForm.buttonText}
                    onChange={handleSliderFormChange}
                    maxLength={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link *</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={sliderForm.buttonLink}
                    onChange={handleSliderFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    name="textOverlay.enabled"
                    checked={sliderForm.textOverlay.enabled}
                    onChange={handleSliderFormChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Enable Text Overlay</label>
                </div>

                {sliderForm.textOverlay.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Text</label>
                      <input
                        type="text"
                        name="textOverlay.text"
                        value={sliderForm.textOverlay.text}
                        onChange={handleSliderFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter overlay text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <select
                        name="textOverlay.position"
                        value={sliderForm.textOverlay.position}
                        onChange={handleSliderFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                      >
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                      <input
                        type="color"
                        name="textOverlay.color"
                        value={sliderForm.textOverlay.color}
                        onChange={handleSliderFormChange}
                        className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                      <input
                        type="text"
                        name="textOverlay.backgroundColor"
                        value={sliderForm.textOverlay.backgroundColor}
                        onChange={handleSliderFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="rgba(0,0,0,0.5)"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={sliderForm.active}
                  onChange={handleSliderFormChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Active (show on homepage)</label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSliderModal(false);
                    setEditingSlider(null);
                    resetForm();
                    setSubmitStatus({ type: '', message: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
                  disabled={submitStatus.type === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus.type === 'loading' || sliderForm.subtitle.length > 500}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitStatus.type === 'loading' ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      {editingSlider ? 'Update' : 'Create'} Slide
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit {editingContent?.title}
            </h3>

            {submitStatus.message && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center ${submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : submitStatus.type === 'error'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-blue-50 text-blue-800'
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

            <form
              id="content-form"
              onSubmit={handleContentSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={contentForm.title}
                  onChange={handleContentFormChange}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Content *
                </label>
                <div className="mb-2">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <span>Markdown supported:</span>
                    <code># Heading</code>
                    <code>**Bold**</code>
                    <code>*Italic*</code>
                    <code>[Link](url)</code>
                  </div>
                </div>
                <textarea
                  name="content"
                  value={contentForm.content}
                  onChange={handleContentFormChange}
                  rows={15}
                  maxLength={10000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {contentForm.content.length}/10,000 characters
                  {contentForm.content.length > 10000 && (
                    <span className="text-red-500 ml-2">Character limit exceeded!</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={contentForm.metaTitle}
                    onChange={handleContentFormChange}
                    maxLength={60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">{contentForm.metaTitle.length}/60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={contentForm.metaDescription}
                    onChange={handleContentFormChange}
                    rows={3}
                    maxLength={160}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">{contentForm.metaDescription.length}/160 characters</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="ri-lightbulb-line text-blue-600 mr-2 mt-0.5"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Content Tips:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Use markdown formatting for better structure</li>
                      <li>• Keep paragraphs concise and scannable</li>
                      <li>• Include relevant keywords naturally</li>
                      <li>• Add contact information and calls-to-action where appropriate</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowContentModal(false);
                    setEditingContent(null);
                    setSubmitStatus({ type: '', message: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
                  disabled={submitStatus.type === 'loading'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus.type === 'loading' || contentForm.content.length > 10000}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitStatus.type === 'loading' ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line mr-2"></i>
                      Save Content
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
