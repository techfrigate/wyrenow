import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  other_name: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  confirm_password: string;
  referral_id: string;
  terms_accepted: boolean;
}

const BasicRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    first_name: '',
    last_name: '',
    other_name: '',
    email: '',
    phone: '',
    country: 'Ghana',
    password: '',
    confirm_password: '',
    referral_id: '',
    terms_accepted: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/v1/registration/basic-register', formData);
      
      setMessage(response.data.message);
      // Reset form
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        other_name: '',
        email: '',
        phone: '',
        country: 'Ghana',
        password: '',
        confirm_password: '',
        referral_id: '',
        terms_accepted: false
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome to</h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        The registration page of both Wyrenow and BTMY. If you are redirected here from BTMY.ORG, 
        you are still at the right page. Go ahead and register
      </p>

      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="other_name"
          placeholder="Other Name"
          value={formData.other_name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="referral_id"
          placeholder="Referral id"
          value={formData.referral_id}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Ghana">Ghana</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            name="terms_accepted"
            checked={formData.terms_accepted}
            onChange={handleChange}
            required
            className="mr-2"
          />
          <span className="text-sm text-gray-600">
            By clicking here, I state that I have read and understood the terms and conditions and I accept them.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit & Register'}
        </button>
      </form>
    </div>
  );
};

export default BasicRegistration;