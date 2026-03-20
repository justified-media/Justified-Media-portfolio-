// app/web-design/[state]/page.js
import { createClient } from '@supabase/supabase-js';
import { getStates, getLGAsByState } from '@some19ice/nigeria-geo-core';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function generateStaticParams() {
  const states = getStates();
  return states.map((state) => ({
    state: state.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }) {
  const { state } = await params;
  const formattedState = state.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    title: `Top Web Designers in ${formattedState} | justified media`,
    description: `Find affordable web design services in ${formattedState}, Nigeria. Professional business websites starting from ₦150,000. Get a quote today.`,
  };
}

export default async function StatePage({ params }) {
  const { state } = await params;
  const formattedState = state.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const lgas = getLGAsByState(formattedState);

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .limit(6);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Top Web Designers in {formattedState}
        </h1>
        
        <p className="text-xl text-gray-400 mb-16 max-w-3xl">
          Professional web design services in {formattedState}, Nigeria. 
          We create stunning, high-converting websites for businesses of all sizes.
        </p>

        <h2 className="text-3xl font-semibold mb-8">
          Cost of Web Design in {formattedState}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              plan: 'Basic',
              price: '₦150,000',
              features: ['1-3 pages', 'Mobile responsive', 'Contact form', 'Basic SEO'],
              gradient: 'from-gray-800 to-gray-900'
            },
            {
              plan: 'Business',
              price: '₦350,000',
              features: ['5-10 pages', 'CMS integration', 'Blog setup', 'Advanced SEO', 'Social media integration'],
              gradient: 'from-blue-900 to-purple-900',
              featured: true
            },
            {
              plan: 'E-commerce',
              price: '₦600,000+',
              features: ['Full online store', 'Payment gateway', 'Inventory management', 'Customer accounts', 'Analytics setup'],
              gradient: 'from-gray-800 to-gray-900'
            }
          ].map((plan, index) => (
            <div key={index} className={`relative group rounded-2xl bg-gradient-to-br ${plan.gradient} p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 ${plan.featured ? 'transform scale-105 shadow-2xl shadow-blue-500/20' : ''}`}>
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.plan}</h3>
              <div className="text-4xl font-bold mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-semibold mb-8">
          Why Choose a Web Designer in {formattedState}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: `Local Expertise in ${formattedState}`,
              description: `We understand the ${formattedState} market and create websites that resonate with your local audience.`,
              icon: '🎯'
            },
            {
              title: 'Affordable Packages',
              description: `Competitive pricing starting from ₦150,000 for businesses in ${formattedState}.`,
              icon: '💰'
            },
            {
              title: 'Fast Turnaround',
              description: `Get your website live in as little as 2 weeks. We work efficiently without compromising quality.`,
              icon: '⚡'
            }
          ].map((item, index) => (
            <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-semibold mb-8">
          Recent Projects in {formattedState}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {projects?.map((project, index) => (
            <div key={index} className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all group">
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                {project.image_url && (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-semibold mb-8">
          Cities We Serve in {formattedState}
        </h2>
        
        <div className="grid md:grid-cols-4 gap-4 mb-20">
          {lgas?.slice(0, 8).map((city, index) => (
            <Link
              key={index}
              href={`/web-design/${state}/${city.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all text-center"
            >
              <span className="text-gray-300 hover:text-white transition-colors">
                {city}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-12 border-t border-gray-800">
          <a
            href={`https://wa.me/2349031493116?text=Hi,%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${encodeURIComponent(formattedState)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-2xl shadow-green-500/20"
          >
            <span className="relative z-10">Chat on WhatsApp</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
          </a>
          
          <a
            href="mailto:ofororayej@gmail.com?subject=Website%20Inquiry&body=Hi%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business."
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-blue-500/20"
          >
            <span className="relative z-10">Email Us</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
          </a>
        </div>
      </div>
    </div>
  );
}