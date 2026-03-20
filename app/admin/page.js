// app/admin/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const inputFields = [
  { id: 1, name: 'title', type: 'text', label: 'Project Title', placeholder: 'e.g. E-commerce Store', required: true },
  { id: 2, name: 'slug', type: 'text', label: 'URL Slug', placeholder: 'e.g. my-cool-project (auto-generated from title if left empty)', required: false },
  { id: 3, name: 'tech_stack', type: 'text', label: 'Technologies Used', placeholder: 'e.g. Next.js, Tailwind, Supabase (comma separated)', required: false },
  { id: 4, name: 'live_url', type: 'url', label: 'Live URL', placeholder: 'https://project-link.com', required: false },
  { id: 5, name: 'seo_title', type: 'text', label: 'SEO Title', placeholder: 'Custom title for Google search results', required: false },
  { id: 6, name: 'meta_description', type: 'textarea', label: 'Meta Description', placeholder: 'The snippet that appears under the link in Google (150-160 characters)', rows: 3, required: false },
  { id: 7, name: 'description', type: 'textarea', label: 'Project Description', placeholder: 'A short summary of what the project does...', rows: 4, required: true },
  { id: 8, name: 'image', type: 'file', label: 'Project Image', placeholder: '', accept: 'image/*', required: false }
];

const InputGroup = ({ field, value, onChange }) => (
  <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
    <label style={{ color: '#2563eb', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
      {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {field.type === 'textarea' ? (
      <textarea
        name={field.name}
        placeholder={field.placeholder}
        rows={field.rows || 4}
        value={value || ""}
        onChange={onChange}
        required={field.required}
        maxLength={field.name === 'meta_description' ? 160 : undefined}
        style={{ 
          padding: '12px', 
          background: 'white', 
          border: '1px solid #e2e8f0', 
          color: '#1e293b',
          borderRadius: '8px',
          fontSize: '14px',
          resize: 'vertical',
          minHeight: field.name === 'meta_description' ? '80px' : '120px',
          fontFamily: 'inherit',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      />
    ) : (
      <input
        name={field.name}
        type={field.type}
        accept={field.accept}
        placeholder={field.placeholder}
        value={field.type === 'file' ? undefined : (value || "")}
        onChange={onChange}
        required={field.required}
        style={{ 
          padding: '12px', 
          background: 'white', 
          border: '1px solid #e2e8f0', 
          color: '#1e293b',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      />
    )}
    {field.name === 'meta_description' && (
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
        {(value || '').length}/160 characters
      </div>
    )}
  </div>
);

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tech_stack: '',
    live_url: '',
    seo_title: '',
    meta_description: '',
    description: '',
    image: null,
    image_url: ''
  });
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && (!formData.slug || formData.slug === generateSlug(formData.title) || !editingId)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title)
      }));
    }
  }, [formData.title]);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!session) {
        window.location.href = '/admin/login';
      } else {
        setUser(session.user);
        fetchProjects();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed. Please login again.');
    }
  };

  const fetchProjects = async () => {
    setFetching(true);
    setError(null);
    
    try {
      console.log('Fetching projects...');
      
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Projects fetched:', data);
      setProjects(data || []);
      
    } catch (err) {
      console.error('Error in fetchProjects:', err);
      setError(err.message || 'Failed to load projects');
      
      // Try to check if table exists
      try {
        const { error: testError } = await supabase
          .from('projects')
          .select('count', { count: 'exact', head: true });
        
        if (testError) {
          console.error('Table check error:', testError);
          setError(`Table error: ${testError.message}. Make sure the 'projects' table exists with correct columns.`);
        }
      } catch (tableErr) {
        console.error('Table check failed:', tableErr);
      }
      
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '',
      slug: '',
      tech_stack: '',
      live_url: '',
      seo_title: '',
      meta_description: '',
      description: '',
      image: null,
      image_url: ''
    });
    setEditingId(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      live_url: project.live_url || '',
      seo_title: project.seo_title || '',
      meta_description: project.meta_description || '',
      description: project.description || '',
      image: null,
      image_url: project.image_url || ''
    });
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      // First get the project to get image path
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete from database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Try to delete image from storage if exists and we have user
      if (project?.image_url && user) {
        try {
          // Extract filename from URL
          const urlParts = project.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          await supabase.storage
            .from('project-images')
            .remove([`${user.id}/${fileName}`]);
        } catch (storageErr) {
          console.error('Storage delete error:', storageErr);
          // Don't throw - image delete is optional
        }
      }

      alert('Project deleted successfully!');
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting project: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required');
      }

      const user = session.user;
      let publicUrl = formData.image_url;

      // Handle image upload if there's a new file
      if (formData.image instanceof File) {
        const file = formData.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl: newPublicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        publicUrl = newPublicUrl;
      }

      // Process tech_stack from comma-separated string to array
      const techStackArray = formData.tech_stack
        ? formData.tech_stack.split(',').map(tech => tech.trim()).filter(tech => tech)
        : [];

      const projectData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        tech_stack: techStackArray,
        live_url: formData.live_url || null,
        seo_title: formData.seo_title || formData.title,
        meta_description: formData.meta_description || formData.description?.substring(0, 160),
        description: formData.description,
        image_url: publicUrl || null
      };

      console.log('Saving project data:', projectData);

      let result;
      if (editingId) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);
      } else {
        // Insert new project
        result = await supabase
          .from('projects')
          .insert([projectData]);
      }

      const { error } = result;
      if (error) throw error;

      alert(editingId ? "✅ Project Updated Successfully!" : "🚀 Project Published Successfully!");
      
      resetForm();
      fetchProjects();

    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      padding: '40px 20px', 
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 
      minHeight: '100vh', 
      color: '#1e293b',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          background: 'white',
          padding: '20px 30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1e40af'
          }}>
            {editingId ? '✏️ Edit Project' : '✨ justified media Admin'}
          </h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/admin/login';
            }}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
          >
            Logout
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#b91c1c',
            padding: '15px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Form Card */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '40px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            {inputFields.map((field) => (
              <InputGroup
                key={field.id}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
              />
            ))}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  flex: 1,
                  padding: '15px', 
                  background: loading ? '#94a3b8' : '#3b82f6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(59,130,246,0.3)'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.background = '#2563eb')}
                onMouseLeave={(e) => !loading && (e.target.style.background = '#3b82f6')}
              >
                {loading ? 'Processing...' : (editingId ? 'Update Project' : 'Publish Project')}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  style={{ 
                    padding: '15px 30px', 
                    background: '#e2e8f0', 
                    color: '#475569', 
                    border: 'none', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#cbd5e1'}
                  onMouseLeave={(e) => e.target.style.background = '#e2e8f0'}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Projects List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            marginBottom: '20px',
            color: '#1e40af'
          }}>
            📁 Your Projects ({projects.length})
          </h2>

          {fetching ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              background: '#f8fafc',
              borderRadius: '8px',
              color: '#64748b'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No projects yet</p>
              <p style={{ fontSize: '0.9rem' }}>Use the form above to add your first project</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {project.image_url ? (
                    <div style={{
                      height: '180px',
                      background: `url(${project.image_url}) center/cover`,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#3b82f6',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {project.tech_stack?.length || 0} technologies
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      height: '180px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '3rem',
                      fontWeight: 'bold'
                    }}>
                      {project.title?.charAt(0) || 'P'}
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px', fontWeight: 'bold', color: '#1e293b' }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
                      slug: {project.slug}
                    </p>
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: '#64748b',
                      marginBottom: '15px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.5'
                    }}>
                      {project.description}
                    </p>
                    
                    {project.seo_title && (
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>
                        <strong>SEO:</strong> {project.seo_title}
                      </p>
                    )}
                    
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
                        {project.tech_stack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {project.live_url && (
                      <a 
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          color: '#3b82f6',
                          fontSize: '0.9rem',
                          marginBottom: '15px',
                          textDecoration: 'none'
                        }}
                      >
                        🔗 View Live
                      </a>
                    )}
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleEdit(project)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: '#3b82f6',
                          border: 'none',
                          color: 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: '#ef4444',
                          border: 'none',
                          color: 'white',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}