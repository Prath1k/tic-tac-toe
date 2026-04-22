'use client';

import React, { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      setLoading(false);
      return;
    }

    const { error } = await signUpWithEmail(email, password, username);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase usually requires email confirmation by default, but we can redirect anyway
      alert('Registration successful! Please check your email for a confirmation link.');
      router.push('/login');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the ultimate competition and save your progress."
    >
      {error && <div className="error-msg">{error}</div>}
      
      <form onSubmit={handleRegister}>
        <AuthInput 
          label="Username"
          type="text"
          placeholder="your_legendary_name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <AuthInput 
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput 
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button className="start-btn" disabled={loading}>
          {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
        </button>
      </form>

      <div className="divider">or</div>
      
      <GoogleButton onClick={handleGoogleLogin} loading={loading} />

      <div className="auth-footer">
        Already have an account? <Link href="/login">Log in</Link>
      </div>
    </AuthLayout>
  );
}
