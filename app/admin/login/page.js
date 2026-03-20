'use client';
import { useState } from 'react'
    
import { supabase } from '@/lib/supabase'


export default function LoginPage(){
   const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading, setLoading] = useState(false);




    const handleLogin = async (e) => {

        e.preventDefault()
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
        })
        if(error){
            alert(error.message);
            setLoading(false)
        }else{
            window.location.href = '/admin'
        }
    }
    
    return(
        
        <main style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: '#121212' 
    }}>
      <form onSubmit={handleLogin} style={{ 
        background: '#1e1e1e', 
        padding: '40px', 
        borderRadius: '8px', 
        width: '350px',
        border: '1px solid #333'
      }}>
        <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'grey', display: 'block', marginBottom: '5px' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', background: 'grey', color: 'white', border: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ color: 'grey', display: 'block', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', background: 'grey', color: 'white', border: 'none' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: loading ? '#555' : '#2e7d32', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Authenticating...' : 'Login to Dashboard'}
        </button>
      </form>
    </main>
    
    )
    console.log("Current User:", supabse.auth.getUser());
}


