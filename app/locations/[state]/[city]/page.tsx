import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Define the params type for TypeScript
interface PageProps {
  params: Promise<{
    state: string
    city: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params

  try {
    const supabase = await createClient()

    // Fetch location data for metadata
    const { data: location, error } = await supabase
      .from('locations')
      .select('seo_title, seo_description')
      .eq('slug_state', state)
      .eq('slug_city', city)
      .single()

    if (error || !location) {
      return {
        title: 'Location Not Found',
        description: 'The requested location page could not be found.',
      }
    }

    return {
      title: location.seo_title,
      description: location.seo_description,
      // Add more SEO metadata as needed (Open Graph, Twitter cards, etc.)
      openGraph: {
        title: location.seo_title,
        description: location.seo_description,
        type: 'website',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Location Page',
      description: 'Professional portfolio location page.',
    }
  }
}

// Server Component for the location page
export default async function LocationPage({ params }: PageProps) {
  const { state, city } = await params

  try {
    const supabase = await createClient()

    // Fetch location data
    const { data: location, error } = await supabase
      .from('locations')
      .select('*')
      .eq('slug_state', state)
      .eq('slug_city', city)
      .single()

    if (error || !location) {
      notFound() // This will render the 404 page
    }

    // Render the location page
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{location.seo_title}</h1>
        <p className="text-lg text-gray-600 mb-6">{location.seo_description}</p>

        {/* Render the content - assuming it's HTML or markdown */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: location.content }}
        />

        {/* Add more location-specific content as needed */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Location: {location.city}, {location.state}
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching location:', error)
    notFound()
  }
}