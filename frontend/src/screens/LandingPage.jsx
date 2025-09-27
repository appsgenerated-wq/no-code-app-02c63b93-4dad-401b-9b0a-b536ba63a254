import React, { useState } from 'react';
import config from '../constants';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password, role);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="lg:w-1/2 flex flex-col justify-center items-start p-8 sm:p-12 lg:p-24">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Fast, Reliable <span className="text-blue-600">Deliveries</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Your items, delivered on time, every time. Join our network of customers and drivers today.
        </p>
        <div className="flex space-x-4">
            <a 
                href={`${config.BACKEND_URL}/admin`} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
            >
                Admin Panel
            </a>
        </div>
      </div>
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-gray-500 mt-2">
              {isLoginView ? 'Sign in to continue' : 'Join as a customer or driver'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            )}
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            {!isLoginView && (
              <div className='bg-gray-100 p-3 rounded-lg'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>I want to sign up as a:</label>
                <div className='flex space-x-4'>
                  <label className='flex items-center'>
                    <input type='radio' name='role' value='customer' checked={role === 'customer'} onChange={() => setRole('customer')} className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300' />
                    <span className='ml-2 text-gray-700'>Customer</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='radio' name='role' value='driver' checked={role === 'driver'} onChange={() => setRole('driver')} className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300' />
                    <span className='ml-2 text-gray-700'>Driver</span>
                  </label>
                </div>
              </div>
            )}
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isLoginView ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-6">
            {isLoginView ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:underline ml-1">
              {isLoginView ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
