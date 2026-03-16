'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Type definitions for better type safety
interface CreateProjectData {
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  imageCaption: string
}

// Server Action for creating a project
export async function createProject(formData: FormData) {
  try {
    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string
    const imageAlt = formData.get('imageAlt') as string
    const imageCaption = formData.get('imageCaption') as string

    // Basic validation
    if (!title || !description || !imageUrl || !imageAlt) {
      throw new Error('All required fields must be provided')
    }

    // Generate slug from title (simple implementation)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create Supabase client
    const supabase = await createClient()

    // Get current user (admin check)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized: Admin access required')
    }

    // Insert project data
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        slug,
        description,
        image_url: imageUrl,
        image_alt: imageAlt,
        image_caption: imageCaption,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to create project')
    }

    // Revalidate the admin page to show the new project
    revalidatePath('/admin')

    // Return success (could redirect or return data)
    return { success: true, project: data }

  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
  }
}

// Additional server actions can be added here
// export async function updateProject(id: string, formData: FormData) { ... }
// export async function deleteProject(id: string) { ... }