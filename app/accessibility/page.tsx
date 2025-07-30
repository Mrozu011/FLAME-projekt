
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccessibilityPage() {
  const [activeTab, setActiveTab] = useState('statement');
  const [reportForm, setReportForm] = useState({
    issueType: '',
    assistiveTech: '',
    description: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const features = [
    {
      category: 'Visual Accessibility',
      items: [
        'High contrast color schemes',
        'Scalable fonts and text sizing',
        'Alt text for all images',
        'Clear visual hierarchy',
        'Focus indicators for keyboard navigation',
        'Color-blind friendly design'
      ]
    },
    {
      category: 'Motor Accessibility',
      items: [
        'Keyboard navigation support',
        'Large clickable areas',
        'Drag and drop alternatives',
        'Voice control compatibility',
        'Switch navigation support',
        'Customizable interface elements'
      ]
    },
    {
      category: 'Cognitive Accessibility',
      items: [
        'Clear and simple language',
        'Consistent navigation patterns',
        'Progress indicators',
        'Error prevention and recovery',
        'Timeout extensions',
        'Content organization and structure'
      ]
    },
    {
      category: 'Auditory Accessibility',
      items: [
        'Closed captions for videos',
        'Audio descriptions',
        'Visual alerts and notifications',
        'Sign language interpretation',
        'Transcript availability',
        'Sound control options'
      ]
    }
  ];

  const guidelines = [
    {
      level: 'WCAG 2.1 Level AA',
      description: 'We comply with Web Content Accessibility Guidelines 2.1 Level AA standards',
      status: 'Compliant'
    },
    {
      level: 'Section 508',
      description: 'Our website meets Section 508 requirements for federal accessibility',
      status: 'Compliant'
    },
    {
      level: 'ADA Compliance',
      description: 'We follow Americans with Disabilities Act guidelines for digital accessibility',
      status: 'Compliant'
    },
    {
      level: 'EN 301 549',
      description: 'European standard for ICT accessibility requirements',
      status: 'Compliant'
    }
  ];

  const tools = [
    {
      name: 'Screen Readers',
      description: 'Compatible with NVDA, JAWS, VoiceOver, and other screen reading software',
      icon: 'ri-volume-up-line'
    },
    {
      name: 'Keyboard Navigation',
      description: 'Full website functionality available through keyboard-only navigation',
      icon: 'ri-keyboard-line'
    },
    {
      name: 'Voice Control',
      description: 'Works with Dragon NaturallySpeaking and other voice control software',
      icon: 'ri-mic-line'
    },
    {
      name: 'Magnification',
      description: 'Compatible with screen magnification software and browser zoom up to 200%',
      icon: 'ri-zoom-in-line'
    }
  ];

  const handleReportFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: 'loading', message: 'Submitting report...' });

    if (!reportForm.issueType || !reportForm.description) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    if (reportForm.description.length > 500) {
      setSubmitStatus({ type: 'error', message: 'Description cannot exceed 500 characters.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('issueType', reportForm.issueType);
      formData.append('assistiveTech', reportForm.assistiveTech);
      formData.append('description', reportForm.description);

      const response = await fetch('https://readdy.ai/api/form/d24787mb5t8jehpp9vsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Report submitted successfully! We will review it within 2 business days.' });
        setReportForm({
          issueType: '',
          assistiveTech: '',
          description: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to submit report. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again or contact us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Accessibility Statement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flame Fashion is committed to ensuring our website is accessible to everyone, regardless of ability or technology used.
          </p>
        </div>

        {/* Quick Access Tools */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-16">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            <i className="ri-accessibility-line mr-2"></i>
            Quick Accessibility Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
              Increase Font Size
            </button>
            <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
              High Contrast Mode
            </button>
            <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
              Keyboard Navigation
            </button>
            <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
              Screen Reader Mode
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'statement', label: 'Accessibility Statement' },
              { id: 'features', label: 'Features' },
              { id: 'guidelines', label: 'Guidelines' },
              { id: 'feedback', label: 'Feedback' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'statement' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Commitment to Accessibility</h2>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                Flame Fashion believes that everyone should have equal access to fashion and our online shopping experience. We are committed to providing a website that is accessible to all users, including those with disabilities.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What We've Done</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Conducted comprehensive accessibility audit</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Implemented WCAG 2.1 Level AA compliance</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Tested with assistive technologies</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Trained our development team on accessibility best practices</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-700">Established ongoing accessibility monitoring</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Improvements</h3>
              <p className="text-gray-600 mb-6">
                We continuously work to improve our website's accessibility. Our development team regularly reviews and updates our site to ensure it meets the latest accessibility standards and user needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Initiatives</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Enhanced keyboard navigation patterns</li>
                    <li>• Improved color contrast ratios</li>
                    <li>• Better focus management</li>
                    <li>• Extended timeout options</li>
                    <li>• Clearer error messages</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Future Plans</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Voice commerce integration</li>
                    <li>• Enhanced mobile accessibility</li>
                    <li>• AI-powered accessibility features</li>
                    <li>• Personalized accessibility settings</li>
                    <li>• Advanced screen reader support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Accessibility Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.category}</h3>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <i className="ri-check-line text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Assistive Technology Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${tool.icon} text-blue-600 text-2xl`}></i>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h4>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Compliance Standards</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {guidelines.map((guideline, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{guideline.level}</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {guideline.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{guideline.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Testing & Validation</h3>
              <p className="text-gray-600 mb-4">
                We regularly test our website using various methods to ensure accessibility compliance:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Automated Testing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Axe accessibility checker</li>
                    <li>• WAVE Web Accessibility Evaluation Tool</li>
                    <li>• Lighthouse accessibility audit</li>
                    <li>• Color contrast analyzers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Manual Testing</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Screen reader testing (NVDA, JAWS, VoiceOver)</li>
                    <li>• Keyboard-only navigation testing</li>
                    <li>• User testing with disabled users</li>
                    <li>• Third-party accessibility audits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Accessibility Feedback</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">We Want to Hear From You</h3>
                <p className="text-gray-600 mb-6">
                  Your feedback helps us improve our website's accessibility. If you encounter any accessibility barriers or have suggestions for improvement, please let us know.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <i className="ri-mail-line text-blue-600 mr-3 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <p className="text-gray-600">accessibility@flame-fashion.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <i className="ri-phone-line text-blue-600 mr-3 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Us</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <i className="ri-chat-1-line text-blue-600 mr-3 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900">Live Chat</h4>
                      <p className="text-gray-600">Available 24/7 with accessibility support</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Report an Issue</h3>

                {submitStatus.message && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      submitStatus.type === 'success' ? 'bg-green-50 text-green-800' :
                        submitStatus.type === 'error' ? 'bg-red-50 text-red-800' :
                          'bg-blue-50 text-blue-800'
                    }`}
                  >
                    {submitStatus.type === 'loading' && (
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                    )}
                    {submitStatus.message}
                  </div>
                )}

                <form id="accessibility-report-form" data-readdy-form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Issue *
                    </label>
                    <select
                      name="issueType"
                      value={reportForm.issueType}
                      onChange={handleReportFormChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      <option value="">Select issue type</option>
                      <option value="navigation">Navigation Problem</option>
                      <option value="content">Content Not Accessible</option>
                      <option value="visual">Visual/Display Issue</option>
                      <option value="audio">Audio/Video Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assistive Technology Used
                    </label>
                    <input
                      type="text"
                      name="assistiveTech"
                      value={reportForm.assistiveTech}
                      onChange={handleReportFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., NVDA, JAWS, VoiceOver"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={reportForm.description}
                      onChange={handleReportFormChange}
                      required
                      maxLength={500}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Please describe the accessibility issue in detail..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {reportForm.description.length}/500 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || reportForm.description.length > 500}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">
                <i className="ri-time-line mr-2"></i>
                Response Time
              </h3>
              <p className="text-green-800">
                We aim to respond to accessibility feedback within 2 business days. For urgent accessibility issues, please call our support line for immediate assistance.
              </p>
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Accessibility Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Settings</h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn how to adjust your browser settings for better accessibility.
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Guide →
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assistive Technology</h3>
              <p className="text-gray-600 text-sm mb-4">
                Information about screen readers and other assistive technologies.
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
              <p className="text-gray-600 text-sm mb-4">
                Quick reference for keyboard navigation shortcuts on our site.
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Shortcuts →
              </button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-black text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Accessibility Support</h2>
          <p className="text-gray-300 mb-8">
            Our accessibility team is here to help. Contact us if you need assistance or have feedback about our website's accessibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:accessibility@flame-fashion.com" className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Email Accessibility Team
            </a>
            <a href="tel:+1-555-123-4567" className="border border-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Call Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
