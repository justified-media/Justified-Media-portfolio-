// app/[state]/[city]/page.js
import { createClient } from '@/utils/supabase/server'
import { getStates, getLGAsByState } from '@some19ice/nigeria-geo-core'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Premium gradient colors for project showcases
const gradientColors = [
  'from-sky-400 to-blue-500',
  'from-blue-400 to-indigo-500',
  'from-cyan-400 to-sky-500',
  'from-indigo-400 to-blue-500',
  'from-sky-500 to-cyan-500',
  'from-blue-500 to-indigo-600',
];

const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    const allowedHostnames = [
      'via.placeholder.com',
      'supabase.co',
    ];
    return allowedHostnames.some(hostname => urlObj.hostname.includes(hostname));
  } catch {
    return false;
  }
};

export async function generateStaticParams() {
  const paths = [];
  const states = getStates();

  states.forEach((stateItem) => {
    const lgas = getLGAsByState(stateItem.id);
    
    lgas.forEach((city) => {
      const cityName = typeof city === 'string' ? city : city.name || city;
      
      paths.push({
        state: stateItem.id,
        city: cityName.toLowerCase().replace(/\s+/g, '-'),
      });
    });
  });

  return paths;
}

export async function generateMetadata({ params }) {
  const { state, city } = await params;
  
  const formattedCity = city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const states = getStates();
  const stateObj = states.find(s => s.id === state);
  const formattedState = stateObj?.name || state.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://web-dev-nigeria.vercel.app';
  const pageUrl = `${baseUrl}/${state}/${city}`;

  return {
    title: `Best Web Designer in ${formattedCity}, ${formattedState} | justified media`,
    description: `Looking for a professional web designer in ${formattedCity}, ${formattedState}? justified media creates stunning, high-converting websites starting from ₦150,000. Get a free quote today!`,
    keywords: `web designer ${formattedCity}, web design ${formattedState}, website designer ${formattedCity}, affordable websites ${formattedState}, ${formattedCity} web development, justified media, web designer Nigeria`,
    authors: [{ name: 'justified media' }],
    creator: 'justified media',
    publisher: 'justified media',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Professional Web Designer in ${formattedCity}, ${formattedState} | justified media`,
      description: `Expert web design services in ${formattedCity}, ${formattedState}. Create a stunning website for your business. Starting at ₦150,000.`,
      url: pageUrl,
      siteName: 'justified media',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `justified media - Web Designer in ${formattedCity}, ${formattedState}`,
        },
      ],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best Web Designer in ${formattedCity}, ${formattedState}`,
      description: `Professional web design services in ${formattedCity}, ${formattedState}. Get a stunning website today!`,
      images: ['/twitter-image.jpg'],
      creator: '@justifiedmedia',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function CityPage({ params }) {
  const { state, city } = await params;
  
  const formattedCity = city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const states = getStates();
  const stateObj = states.find(s => s.id === state);
  
  if (!stateObj) notFound();
  
  const formattedState = stateObj.name;
  const lgas = getLGAsByState(stateObj.id);
  
  const cityNames = lgas.map(c => typeof c === 'string' ? c : c.name || c);
  const cityNamesNormalized = cityNames.map((name) => String(name).trim().toLowerCase());
  if (!cityNamesNormalized.includes(formattedCity.toLowerCase())) notFound();

  // Create Supabase server client for data fetching
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .limit(6);

  const safeProjects = projects || [];

  // Reusable CTA Buttons Component
  const CTAButtons = ({ isCompact = false, alignment = 'center' }) => (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${alignment === 'center' ? 'justify-center' : 'justify-start'} ${isCompact ? 'mt-4' : 'mt-6 sm:mt-8'}`}>
      <a
        href={`https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${encodeURIComponent(formattedCity)}%2C%20${encodeURIComponent(formattedState)}.`}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative ${isCompact ? 'px-4 py-2 text-sm' : 'px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg'} bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-2xl shadow-green-500/20 text-center w-full sm:w-auto`}
      >
        <span className="relative z-10">Chat on WhatsApp</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
      </a>
      
      <a
        href={`mailto:ofororayej@gmail.com?subject=Website%20Inquiry%20for%20${formattedCity}&body=Hi%20justified%20media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${formattedCity}%2C%20${formattedState}.`}
        className={`group relative ${isCompact ? 'px-4 py-2 text-sm' : 'px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg'} bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-blue-500/20 text-center w-full sm:w-auto`}
      >
        <span className="relative z-10">Email Us</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
      </a>
    </div>
  );

  // Structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `justified media - Web Designer in ${formattedCity}, ${formattedState}`,
    "image": "https://web-dev-nigeria.vercel.app/logo.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": formattedCity,
      "addressRegion": formattedState,
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "9.081999",
      "longitude": "8.675277"
    },
    "url": `https://web-dev-nigeria.vercel.app/${state}/${city}`,
    "telephone": "+2349031493116",
    "priceRange": "₦150,000 - ₦1,500,000",
    "openingHours": "Mo-Fr 09:00-18:00",
    "sameAs": [
      "https://twitter.com/justifiedmedia",
      "https://instagram.com/justifiedmedia"
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href={`/${state}`} className="hover:text-blue-600 transition-colors">
                {formattedState}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{formattedCity}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-400 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Best Web Designer in {formattedCity}, {formattedState}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8 max-w-3xl">
                justified media creates stunning, high-converting websites that help businesses in {formattedCity} stand out and attract more customers. 
                Professional web design tailored to your local market.
              </p>
              <CTAButtons />
            </div>
          </div>
        </div>

        {/* Trust Badges - Sticky on mobile */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[
                { number: '50+', label: `Projects in ${formattedState}` },
                { number: '5+', label: 'Years Experience' },
                { number: '100%', label: 'Client Satisfaction' },
                { number: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Why Choose Us Section */}
          <section className="mb-16 sm:mb-20 md:mb-24">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Why Choose justified media in {formattedCity}, {formattedState}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mt-2 max-w-3xl">
                  We specialize in creating websites that help local businesses in {formattedCity} attract more customers and grow online.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <CTAButtons isCompact={true} alignment="right" />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  title: `Local SEO Experts`,
                  description: `We know how to help businesses in ${formattedCity} rank #1 on Google.`,
                  icon: '🎯',
                  color: 'from-blue-500 to-sky-500'
                },
                {
                  title: `Fast Loading`,
                  description: `Websites optimized for Nigerian internet speeds and mobile devices.`,
                  icon: '⚡',
                  color: 'from-sky-500 to-cyan-500'
                },
                {
                  title: `Conversion Focused`,
                  description: `Designed to turn visitors in ${formattedCity} into paying customers.`,
                  icon: '📈',
                  color: 'from-indigo-500 to-blue-500'
                },
                {
                  title: `Local Support`,
                  description: `We understand the ${formattedState} market and business culture.`,
                  icon: '🤝',
                  color: 'from-blue-600 to-indigo-600'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl shadow-blue-100/50 border border-blue-100 hover:shadow-2xl hover:shadow-blue-200/50 transition-all">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Long Does It Take Section */}
          <section className="mb-16 sm:mb-20 md:mb-24 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  How Long Does It Take to Build a Website in {formattedCity}?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mt-2">
                  Get your business online fast with our efficient process.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <CTAButtons isCompact={true} />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  days: '5-7',
                  title: 'Basic Website',
                  description: `Simple brochure sites for small businesses in ${formattedCity}`,
                  features: ['Ready in 1 week', 'Perfect for startups', 'Quick online presence']
                },
                {
                  days: '10-14',
                  title: 'Business Website',
                  description: `Professional sites for established ${formattedCity} businesses`,
                  features: ['2-3 weeks', 'Custom design', 'CMS included'],
                  highlight: true
                },
                {
                  days: '20-30',
                  title: 'E-commerce Store',
                  description: `Full online stores for ${formattedCity} retailers`,
                  features: ['3-4 weeks', 'Payment integration', 'Product management']
                }
              ].map((item, index) => (
                <div key={index} className={`bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 ${item.highlight ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : 'shadow-xl'}`}>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-2">{item.days}</div>
                  <div className="text-xs sm:text-sm text-blue-500 mb-3 sm:mb-4">days</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section className="mb-16 sm:mb-20 md:mb-24">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Websites We've Built for Businesses in {formattedState}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mt-2">
                  See how we've helped businesses like yours succeed online.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <CTAButtons isCompact={true} />
              </div>
            </div>

            {safeProjects.length === 0 ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
                <p className="text-lg sm:text-xl text-blue-800 mb-2">✨ Projects Coming Soon</p>
                <p className="text-sm sm:text-base text-blue-600">We're currently updating our portfolio. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-12">
                {safeProjects.map((project, index) => {
                  const hasValidImage = project.image_url && isValidImageUrl(project.image_url);
                  const gradientClass = gradientColors[index % gradientColors.length];
                  
                  return (
                    <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-blue-100`}>
                      <div className="lg:w-1/2 relative h-64 sm:h-80 lg:h-96">
                        {hasValidImage ? (
                          <Image
                            src={project.image_url}
                            alt={project.title || 'Project showcase'}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                            unoptimized={project.image_url.includes('via.placeholder.com')}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                            <span className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white opacity-30">
                              {project.title ? project.title.charAt(0).toUpperCase() : 'JM'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                        <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-2">FEATURED PROJECT</div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">{project.title || 'Untitled Project'}</h3>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6">{project.description || 'No description available'}</p>
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                            {project.tech_stack.map((tech, idx) => (
                              <span key={idx} className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-50 text-blue-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Live Website Link */}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 mb-4 sm:mb-6 text-sm sm:text-base group"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit Live Website
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        )}
                        
                        <a
                          href={`https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I%20saw%20the%20${project.title || 'project'}%20and%20I'm%20interested%20in%20a%20similar%20website%20for%20my%20business%20in%20${encodeURIComponent(formattedCity)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm sm:text-base"
                        >
                          Want a similar website?
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* How Much Does It Cost Section */}
          <section className="mb-16 sm:mb-20 md:mb-24" id="pricing">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  How Much Does a Website Cost in {formattedState}?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mt-2">
                  Transparent pricing for businesses in {formattedCity} and across {formattedState}. No hidden fees.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <CTAButtons isCompact={true} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  name: 'Basic',
                  price: '₦150,000',
                  description: `Perfect for small businesses in ${formattedCity} just starting out`,
                  features: [
                    '1-3 pages',
                    'Mobile responsive',
                    'Contact form',
                    'Basic SEO',
                    'Social media links',
                    'Google Maps integration',
                    '1 month support'
                  ]
                },
                {
                  name: 'Business',
                  price: '₦350,000',
                  description: `Ideal for established ${formattedCity} businesses ready to grow`,
                  features: [
                    '5-10 pages',
                    'CMS (WordPress)',
                    'Blog setup',
                    'Advanced local SEO',
                    'Email marketing integration',
                    'Analytics setup',
                    '3 months support'
                  ],
                  popular: true
                },
                {
                  name: 'E-commerce',
                  price: '₦600,000+',
                  description: `Full online stores for ${formattedCity} retailers`,
                  features: [
                    'Unlimited products',
                    'Payment gateway',
                    'Inventory management',
                    'Customer accounts',
                    'Order tracking',
                    'Marketing tools',
                    '6 months support'
                  ]
                }
              ].map((plan, index) => (
                <div key={index} className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl ${plan.popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105 relative' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-sky-400 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{plan.price}</div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{plan.description}</p>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I'm%20interested%20in%20the%20${plan.name}%20plan%20for%20my%20business%20in%20${encodeURIComponent(formattedCity)}%2C%20${encodeURIComponent(formattedState)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all text-sm sm:text-base ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-sky-400 text-white hover:from-blue-700 hover:to-sky-500' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16 sm:mb-20 md:mb-24">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Frequently Asked Questions About Web Design in {formattedCity}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mt-2">
                  Everything you need to know about getting a website for your {formattedCity} business.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <CTAButtons isCompact={true} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  q: `How much does a website cost in ${formattedCity}?`,
                  a: `Websites in ${formattedCity} start from ₦150,000 for a basic brochure site, up to ₦600,000+ for e-commerce stores. The exact price depends on your specific needs and features.`
                },
                {
                  q: `How long does it take to build a website in ${formattedState}?`,
                  a: `Most websites take 2-4 weeks to complete. Basic sites can be ready in 1 week, while complex e-commerce stores may take 4-6 weeks.`
                },
                {
                  q: `Do you offer SEO services for ${formattedCity} businesses?`,
                  a: `Yes! All our websites include local SEO optimization to help you rank higher in ${formattedCity} Google searches.`
                },
                {
                  q: `Can I update the website myself?`,
                  a: `Absolutely! We build websites with easy-to-use content management systems (CMS) so you can update content anytime.`
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-blue-100">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">{faq.q}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Other Cities */}
          <section className="mb-16 sm:mb-20 md:mb-24">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 sm:mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Other Cities in {formattedState} We Serve
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Web design services available across all major locations.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <CTAButtons isCompact={true} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {cityNames
                .filter(c => c !== formattedCity)
                .slice(0, 20)
                .map((otherCity, index) => {
                  const citySlug = otherCity.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={index}
                      href={`/${state}/${citySlug}`}
                      className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-center"
                    >
                      <span className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        {otherCity}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-sky-400 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Grow Your Business in {formattedCity}?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Get a professional website that attracts more customers and grows your business.
            </p>
            <CTAButtons />
          </section>
        </div>
      </div>
    </>
  );
}