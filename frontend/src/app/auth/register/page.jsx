'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/authcontext';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    coverImage: null,
  });
  const router = useRouter();
  const { setIsAuthenticated } = useAuth(); 
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('fullname', form.fullname);
      formData.append('password', form.password);
      
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      }
      
      if (form.coverImage) {
        formData.append('coverImage', form.coverImage);
      }

      // First register the user
      const registerRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/users/register`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // This ensures cookies are stored after registration
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(registerData.message || 'Registration failed');
      }

      console.log('User registered successfully:', registerData);
      
      // Now login the user with the same credentials to ensure session is created
      const loginFormData = new FormData();
      loginFormData.append('email', form.email);
      loginFormData.append('password', form.password);
      
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/users/login`, {
        method: 'POST',
        body: loginFormData,
        credentials: 'include', // This ensures cookies are stored
      });
      
      const loginData = await loginRes.json();
      
      if (!loginRes.ok) {
        throw new Error(loginData.message || 'Registration successful but login failed');
      }

      // Update authentication state and redirect
      setIsAuthenticated(true);
      alert("User registered successfully!");
      router.push("/");
      
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-6 rounded-xl max-w-md w-full space-y-4 shadow-lg"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-semibold text-center">Register</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full bg-gray-800 p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-gray-800 p-2 rounded"
          required
        />

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          className="w-full bg-gray-800 p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full bg-gray-800 p-2 rounded"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full bg-gray-800 p-2 rounded"
          required
        />

        <div className="text-sm text-gray-400">Avatar (Required):</div>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
          className="w-full bg-gray-800 p-2 rounded"
          required
        />

        <div className="text-sm text-gray-400">Cover Image (Optional):</div>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleChange}
          className="w-full bg-gray-800 p-2 rounded"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-bold ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className="text-sm text-center">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/auth/login')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}