// app/web-design/[state]/[city]/page.js
import { createClient } from '@supabase/supabase-js';
import { getStates, getLGAsByState } from '@some19ice/nigeria-geo-core';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
    const lgas = getLGAsByState(stateItem.name);
    
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justifiedmedia.ng';
  const pageUrl = `${baseUrl}/web-design/${state}/${city}`;

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
    verification: {
      google: 'your-google-verification-code',
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
  const formattedState = stateObj?.name || state.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const lgas = stateObj ? getLGAsByState(stateObj.name) : [];

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .limit(6);

  const safeProjects = projects || [];

  // Structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `justified media - Web Designer in ${formattedCity}, ${formattedState}`,
    "image": "https://justifiedmedia.ng/logo.jpg",
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
    "url": `https://justifiedmedia.ng/web-design/${state}/${city}`,
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-400 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Best Web Designer in {formattedCity}, {formattedState}
              </h1>
              <p className="text-xl text-blue-50 mb-8 max-w-3xl">
                justified media creates stunning, high-converting websites that help businesses in {formattedCity} stand out and attract more customers. 
                Professional web design tailored to your local market.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${encodeURIComponent(formattedCity)}%2C%20${encodeURIComponent(formattedState)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-lg font-semibold hover:bg-blue-50 transition-all shadow-2xl shadow-blue-500/30"
                >
                  Get Free Quote
                </a>
                <a
                  href="#pricing"
                  className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl text-lg font-semibold hover:bg-blue-500/30 transition-all"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '50+', label: `Projects in ${formattedState}` },
                { number: '5+', label: 'Years Experience' },
                { number: '100%', label: 'Client Satisfaction' },
                { number: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Why Choose Us Section */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Why Choose justified media for Web Design in {formattedCity}, {formattedState}
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl">
              We specialize in creating websites that help local businesses in {formattedCity} attract more customers and grow online.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div key={index} className="bg-white rounded-2xl p-8 shadow-xl shadow-blue-100/50 border border-blue-100 hover:shadow-2xl hover:shadow-blue-200/50 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6 text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Long Does It Take Section */}
          <section className="mb-24 bg-gradient-to-r from-blue-50 to-sky-50 rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              How Long Does It Take to Build a Website in {formattedCity}?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
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
                <div key={index} className={`bg-white rounded-2xl p-8 ${item.highlight ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : 'shadow-xl'}`}>
                  <div className="text-5xl font-bold text-blue-600 mb-2">{item.days}</div>
                  <div className="text-sm text-blue-500 mb-4">days</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Websites We've Built for Businesses in {formattedState}
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              See how we've helped businesses like yours succeed online.
            </p>

            <div className="space-y-12">
              {safeProjects.map((project, index) => {
                const hasValidImage = project.image_url && isValidImageUrl(project.image_url);
                const gradientClass = gradientColors[index % gradientColors.length];
                
                return (
                  <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100`}>
                    <div className="lg:w-1/2 relative h-96">
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
                          <span className="text-8xl font-bold text-white opacity-30">
                            {project.title ? project.title.charAt(0).toUpperCase() : 'JM'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                      <div className="text-sm text-blue-600 font-semibold mb-2">FEATURED PROJECT</div>
                      <h3 className="text-3xl font-bold mb-4 text-gray-900">{project.title || 'Untitled Project'}</h3>
                      <p className="text-gray-600 text-lg mb-6">{project.description || 'No description available'}</p>
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.tech_stack.map((tech, idx) => (
                            <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <a
                        href={`https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I%20saw%20the%20${project.title || 'project'}%20and%20I'm%20interested%20in%20a%20similar%20website%20for%20my%20business%20in%20${encodeURIComponent(formattedCity)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
                      >
                        Want a similar website?
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How Much Does It Cost Section */}
          <section className="mb-24" id="pricing">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              How Much Does a Website Cost in {formattedState}?
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Transparent pricing for businesses in {formattedCity} and across {formattedState}. No hidden fees.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
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
                <div key={index} className={`bg-white rounded-3xl p-8 shadow-xl ${plan.popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105 relative' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-sky-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{plan.price}</div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                    className={`block text-center px-6 py-3 rounded-xl font-semibold transition-all ${
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
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions About Web Design in {formattedCity}
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Everything you need to know about getting a website for your {formattedCity} business.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
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
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Other Cities */}
          <section className="mb-24">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Other Cities in {formattedState} We Serve
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {lgas
                .filter(c => {
                  const cityName = typeof c === 'string' ? c : c.name || c;
                  return cityName.toLowerCase().replace(/\s+/g, '-') !== city;
                })
                .slice(0, 15)
                .map((otherCity, index) => {
                  const cityName = typeof otherCity === 'string' ? otherCity : otherCity.name || otherCity;
                  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={index}
                      href={`/web-design/${state}/${citySlug}`}
                      className="bg-white rounded-xl p-3 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-center"
                    >
                      <span className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                        {cityName}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-sky-400 rounded-3xl p-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Grow Your Business in {formattedCity}?
            </h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Get a professional website that attracts more customers and grows your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I'm%20ready%20to%20discuss%20my%20website%20for%20my%20business%20in%20${encodeURIComponent(formattedCity)}%2C%20${encodeURIComponent(formattedState)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-lg font-semibold hover:bg-blue-50 transition-all"
              >
                Chat on WhatsApp
              </a>
              <a
                href={`mailto:ofororayej@gmail.com?subject=Website%20Inquiry%20for%20${formattedCity}&body=Hi%20justified%20media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${formattedCity}%2C%20${formattedState}.`}
                className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl text-lg font-semibold hover:bg-blue-500/30 transition-all"
              >
                Email Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}