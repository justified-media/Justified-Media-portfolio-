'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const inputFields = [
  { id: 1, name: 'title', type: 'text', label: 'Project Title', placeholder: 'e.g. E-commerce for Lagos Boutique' },

  { id: 3, name: 'live_url', type: 'url', label: 'Live URL', placeholder: 'https://project-link.com' },
  { id: 4, name: 'description', type: 'text', label: 'Project Description', placeholder: 'Briefly describe the project goals...' },
  { id: 5, name: 'image', type: 'file', label: 'Project Image', placeholder: '', accept: 'image/*' }
];

const InputGroup = ({ field, value, onChange }) => (
  <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
    <label style={{ color: '#aaa', marginBottom: '8px', fontSize: '14px' }}>{field.label}</label>
    <input
      name={field.name}
      type={field.type}
      accept={field.accept}
      value={field.type === 'file' ? undefined : (value || "")}
      onChange={onChange}
      required
      style={{ 
        padding: '12px', 
        background: '#2a2a2a', 
        border: '1px solid #444', 
        color: 'white',
        borderRadius: '4px'
      }}
    />
  </div>
);

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    live_url: '',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === 'file' ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        alert("Authentication required. Please login again.");
        window.location.href = '/admin/login';
        return;
      }

      const user = session.user;
      console.log("Authenticated user:", user.id);

      const file = formData.image;
      if (!file) {
        alert("Please select an image!");
        setLoading(false);
        return;
      }

      // 2. Upload image to Storage with proper path structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log("Uploading to path:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        
        if (uploadError.message.includes("row-level security")) {
          throw new Error("Storage permission denied. Please check if you're logged in and the bucket exists.");
        }
        throw uploadError;
      }

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      console.log("Upload successful, public URL:", publicUrl);

      // 4. Check which columns exist in your table
      // First, let's check what columns are available
      const { data: columns, error: columnsError } = await supabase
        .from('projects')
        .select('*')
        .limit(1);

      console.log("Available columns:", columns ? Object.keys(columns[0] || {}) : 'No data');

      // 5. Insert project data into database - REMOVED created_at
      const projectData = {
        title: formData.title,
      
        live_url: formData.live_url,
        description: formData.description,
        image_url: publicUrl
     
      };

      // If you have a different column name for image, adjust here
      // Common alternatives: 'image', 'image_path', 'cover_image'
      console.log("Inserting data:", projectData);

      const { error: dbError } = await supabase
        .from('projects')
        .insert([projectData]);

      if (dbError) {
        console.error("Database error:", dbError);
        
        // Handle specific column errors
        if (dbError.message.includes('image_url')) {
          throw new Error("Your table might use a different column name for images. Try changing 'image_url' to 'image' in the code.");
        }
        throw dbError;
      }

      alert("🚀 Project Published Successfully!");
      
      // Reset form
      setFormData({ 
        title: '', 
      
        live_url: '', 
        description: '', 
        image: null 
      });
      
      // Reset file input
      e.target.reset();

    } catch (err) {
      console.error("Submission error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      padding: '40px', 
      background: '#121212', 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        background: '#1e1e1e', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ 
          marginBottom: '30px', 
          textAlign: 'center',
          color: '#fff',
          fontSize: '2rem'
        }}>
          Add New Project
        </h1>
        
        <form onSubmit={handleSubmit}>
          {inputFields.map((field) => (
            <InputGroup
              key={field.id}
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ))}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '15px', 
              background: loading ? '#444' : '#2e7d32', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '20px',
              transition: 'background 0.3s ease'
            }}
          >
            {loading ? 'Publishing...' : 'Publish Project'}
          </button>
        </form>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/admin/login';
          }}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            color: '#ff4444',
            border: '1px solid #ff4444',
            borderRadius: '4px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}