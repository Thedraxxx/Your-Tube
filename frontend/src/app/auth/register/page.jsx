'use client';

import { use, useState } from 'react';
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

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('fullname', form.fullname);
    formData.append('password', form.password);
    formData.append('avatar', form.avatar);
    if (form.coverImage) formData.append('coverImage', form.coverImage);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/users/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('User registered:', data);
      alert("user registerd successfully")
      setIsAuthenticated(true); 
      router.push("/");
    } catch (err) {
      setError(err.message);
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
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-bold"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
