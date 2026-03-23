import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

// Define the params type for JSDoc (since this is .js file)
/**
 * @typedef {Object} PageProps
 * @property {Promise<{state: string, city: string}>} params
 */

/**
 * Generate static params for all location pages
 * This enables static generation for better SEO and performance
 * @returns {Promise<Array<{state: string, city: string}>>}
 */
export async function generateStaticParams() {
  try {
    const supabase = await createClient()

    // Fetch all locations to generate static paths
    const { data: locations, error } = await supabase
      .from('locations')
      .select('slug_state, slug_city')

    if (error || !locations) {
      console.error('Error fetching locations for static params:', error)
      return []
    }

    return locations.map((location) => ({
      state: location.slug_state,
      city: location.slug_city,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

/**
 * Generate metadata for SEO optimization
 * Uses server-side data fetching for better SEO performance
 * @param {PageProps} props
 * @returns {Promise<Object>} Metadata object for Next.js
 */
export async function generateMetadata({ params }) {
  const { state, city } = await params

  try {
    const supabase = await createClient()

    // Fetch location data for metadata - optimized query selecting only needed fields
    const { data: location, error } = await supabase
      .from('locations')
      .select('seo_title, seo_description, state, city')
      .eq('slug_state', state)
      .eq('slug_city', city)
      .single()

    if (error || !location) {
      return {
        title: 'Location Not Found | Justified Media',
        description: 'The requested location page could not be found.',
      }
    }

    // Enhanced SEO metadata with Open Graph and Twitter cards
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://justifiedmedia.ng'
    const pageUrl = `${baseUrl}/locations/${state}/${city}`

    return {
      title: location.seo_title,
      description: location.seo_description,
      keywords: `web design ${location.city}, website development ${location.state}, professional web services ${location.city} ${location.state}`,
      authors: [{ name: 'Justified Media' }],
      creator: 'Justified Media',
      publisher: 'Justified Media',
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
        title: location.seo_title,
        description: location.seo_description,
        url: pageUrl,
        siteName: 'Justified Media',
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `Justified Media - Web Design Services in ${location.city}, ${location.state}`,
          },
        ],
        locale: 'en_NG',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: location.seo_title,
        description: location.seo_description,
        images: ['/og-image.jpg'],
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
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Location Page | Justified Media',
      description: 'Professional web design and development services.',
    }
  }
}

/**
 * Server Component for location pages
 * Uses server-side rendering for optimal SEO and performance
 * @param {PageProps} props
 */
export default async function LocationPage({ params }) {
  const { state, city } = await params

  try {
    const supabase = await createClient()

    // Fetch complete location data - single optimized query
    const { data: location, error } = await supabase
      .from('locations')
      .select('*')
      .eq('slug_state', state)
      .eq('slug_city', city)
      .single()

    if (error || !location) {
      notFound() // Triggers 404 page
    }

    // Fetch related projects for this location (optional enhancement)
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, slug, description, image_url, image_alt, created_at')
      .limit(3)

    const safeProjects = projects || []

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-400 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                {location.seo_title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8 max-w-3xl mx-auto">
                {location.seo_description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href={`https://wa.me/2349031493116?text=Hi%20Justified%20Media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${encodeURIComponent(location.city)}%2C%20${encodeURIComponent(location.state)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-2xl shadow-green-500/20 text-center w-full sm:w-auto"
                >
                  <span className="relative z-10">Chat on WhatsApp</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                </a>

                <a
                  href={`mailto:ofororayej@gmail.com?subject=Website%20Inquiry%20for%20${encodeURIComponent(location.city)}&body=Hi%20Justified%20Media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${encodeURIComponent(location.city)}%2C%20${encodeURIComponent(location.state)}.`}
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-blue-500/20 text-center w-full sm:w-auto"
                >
                  <span className="relative z-10">Email Us</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Location Content */}
          <section className="mb-16 sm:mb-20 md:mb-24">
            <div className="prose prose-lg max-w-none mx-auto">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: location.content }}
              />
            </div>
          </section>

          {/* Featured Projects Section */}
          {safeProjects.length > 0 && (
            <section className="mb-16 sm:mb-20 md:mb-24">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
                Recent Projects in {location.city}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                See some of our recent work for businesses in {location.city}, {location.state}.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {safeProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-blue-100 hover:shadow-2xl transition-all group">
                    <div className="relative h-48 sm:h-56">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.image_alt || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                          <span className="text-4xl font-bold text-white opacity-30">
                            {project.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      <a
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm group"
                      >
                        View Project
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-sky-400 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Grow Your Business in {location.city}?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Get a professional website that attracts more customers and grows your business in {location.state}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href={`https://wa.me/2349031493116?text=Hi%20Justified%20Media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${encodeURIComponent(location.city)}%2C%20${encodeURIComponent(location.state)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-2xl shadow-green-500/20 text-center w-full sm:w-auto"
              >
                <span className="relative z-10">Chat on WhatsApp</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              </a>

              <a
                href={`mailto:ofororayej@gmail.com?subject=Website%20Inquiry%20for%20${encodeURIComponent(location.city)}&body=Hi%20Justified%20Media%2C%20I'm%20interested%20in%20a%20website%20for%20my%20business%20in%20${encodeURIComponent(location.city)}%2C%20${encodeURIComponent(location.state)}.`}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-blue-500/20 text-center w-full sm:w-auto"
              >
                <span className="relative z-10">Email Us</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              </a>
            </div>
          </section>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching location:', error)
    notFound()
  }
}