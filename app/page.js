// app/page.js
import { createClient } from '@/utils/supabase/server'
import { getStates, getLGAsByState } from '@some19ice/nigeria-geo-core'
import Image from 'next/image'
import Link from 'next/link'

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
    const allowedHostnames = ['via.placeholder.com', 'supabase.co'];
    return allowedHostnames.some(hostname => urlObj.hostname.includes(hostname));
  } catch {
    return false;
  }
};

export async function generateMetadata() {
  return {
    title: 'Professional Web Design Services Nigeria | justified media',
    description: 'Get professional web design services in Nigeria. We create stunning, high-converting websites for businesses nationwide. Starting from ₦150,000. Get a free quote today!',
    keywords: 'web design Nigeria, website designer Nigeria, professional web design, affordable websites Nigeria, web development Nigeria',
    authors: [{ name: 'justified media' }],
    creator: 'justified media',
    publisher: 'justified media',
    openGraph: {
      title: 'Professional Web Design Services Nigeria | justified media',
      description: 'Expert web design services across Nigeria. Create a stunning website for your business. Starting at ₦150,000.',
      url: 'https://justifiedmedia.ng',
      siteName: 'justified media',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
      locale: 'en_NG',
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const states = getStates();

  // Calculate total cities across all states
  let totalCities = 0;
  const statesWithCities = states.map(stateObj => {
    // getLGAsByState expects a state id (is lower-case & hyphenated), not the display name
    const lgas = getLGAsByState(stateObj.id);
    const cityNames = lgas.map(c => typeof c === 'string' ? c : c.name || c);
    totalCities += cityNames.length;
    return {
      ...stateObj,
      cities: cityNames,
      cityCount: cityNames.length
    };
  });

  // Create Supabase server client for data fetching
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .limit(6);

  const safeProjects = projects || [];

  const CTAButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <a
        href="https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-2xl shadow-green-500/20 text-center w-full sm:w-auto"
      >
        <span className="relative z-10">Chat on WhatsApp</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
      </a>
      
      <a
        href="mailto:ofororayej@gmail.com?subject=Website%20Inquiry&body=Hi%20justified%20media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business."
        className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-blue-500/20 text-center w-full sm:w-auto"
      >
        <span className="relative z-10">Email Us</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Professional Web Design Services in Nigeria
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8 max-w-3xl mx-auto">
              justified media creates stunning, high-converting websites that help businesses across Nigeria stand out and attract more customers.
            </p>
            <CTAButtons />
            <div className="mt-8 text-center">
              <Link href="/sitemap.xml" className="text-sm text-white underline hover:text-blue-100">
                View our sitemap for all pages (XML)
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 sm:mb-20">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-blue-100">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{states.length}</div>
            <div className="text-sm sm:text-base text-gray-600">States Covered</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-blue-100">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{totalCities}+</div>
            <div className="text-sm sm:text-base text-gray-600">Cities & Towns</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-blue-100">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-sm sm:text-base text-gray-600">Client Satisfaction</div>
          </div>
        </div>

        {/* All States Section */}
        <section className="mb-16 sm:mb-20 md:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
            Web Design Services Across All 36 States
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We provide professional web design services in every state of Nigeria, covering all major cities and towns.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {statesWithCities.map((stateObj) => (
              <Link
                key={stateObj.id}
                href={`/${stateObj.id}`}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium block">
                    {stateObj.name}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {stateObj.cityCount} cities
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured States with Cities */}
        <section className="mb-16 sm:mb-20 md:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
            Popular States & Their Cities
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our web design services in Nigeria's most populous states.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statesWithCities.slice(0, 6).map((stateObj) => (
              <div key={stateObj.id} className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-sky-400 p-4">
                  <Link href={`/${stateObj.id}`}>
                    <h3 className="text-xl font-bold text-white text-center hover:underline">
                      {stateObj.name}
                    </h3>
                  </Link>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-2">
                    {stateObj.cities.slice(0, 8).map((city, idx) => {
                      const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link
                          key={idx}
                          href={`/${stateObj.id}/${citySlug}`}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                        >
                          {city}
                        </Link>
                      );
                    })}
                  </div>
                  {stateObj.cityCount > 8 && (
                    <div className="text-center mt-4">
                      <Link
                        href={`/${stateObj.id}`}
                        className="text-sm text-blue-600 font-semibold hover:text-blue-700"
                      >
                        +{stateObj.cityCount - 8} more cities
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-16 sm:mb-20 md:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
            Our Recent Work
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            See how we've helped businesses across Nigeria succeed online.
          </p>

          {safeProjects.length === 0 ? (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
              <p className="text-lg sm:text-xl text-blue-800 mb-2">✨ Projects Coming Soon</p>
              <p className="text-sm sm:text-base text-blue-600">We're currently updating our portfolio. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {safeProjects.map((project, index) => {
                const hasValidImage = project.image_url && isValidImageUrl(project.image_url);
                const gradientClass = gradientColors[index % gradientColors.length];
                
                return (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-blue-100 hover:shadow-2xl transition-all group">
                    <div className="relative h-48 sm:h-56">
                      {hasValidImage ? (
                        <Image
                          src={project.image_url}
                          alt={project.title || 'Project showcase'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                          <span className="text-6xl font-bold text-white opacity-30">
                            {project.title ? project.title.charAt(0).toUpperCase() : 'JM'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title || 'Untitled Project'}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description || 'No description available'}</p>
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm group"
                        >
                          Visit Live Website
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Pricing Section */}
        <section className="mb-16 sm:mb-20 md:mb-24" id="pricing">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
            Our Web Design Packages
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Transparent pricing for businesses across Nigeria. No hidden fees.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Basic',
                price: '₦150,000',
                description: 'Perfect for small businesses just starting out',
                features: ['1-3 pages', 'Mobile responsive', 'Contact form', 'Basic SEO', 'Social media links', '1 month support']
              },
              {
                name: 'Business',
                price: '₦350,000',
                description: 'Ideal for established businesses ready to grow',
                features: ['5-10 pages', 'CMS (WordPress)', 'Blog setup', 'Advanced SEO', 'Email marketing', 'Analytics setup', '3 months support'],
                popular: true
              },
              {
                name: 'E-commerce',
                price: '₦600,000+',
                description: 'Full online stores for retailers',
                features: ['Unlimited products', 'Payment gateway', 'Inventory management', 'Customer accounts', 'Order tracking', 'Marketing tools', '6 months support']
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
                  href="https://wa.me/2349031493116?text=Hi%20justified%20media%2C%20I'm%20interested%20in%20getting%20a%20website%20for%20my%20business."
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

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-sky-400 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Grow Your Business Online?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Get a professional website that attracts more customers and grows your business.
          </p>
          <CTAButtons />
        </section>
      </div>
    </div>
  );
}