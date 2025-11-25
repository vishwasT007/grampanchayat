import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Shield, Lock, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Tricolor Top Border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 via-white to-green-600"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Premium Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-orange-600">
          <div className="bg-gradient-to-r from-orange-600 to-green-600 h-2"></div>
          
          {/* Header Section */}
          <div className="text-center pt-12 pb-8 px-8 bg-gradient-to-br from-blue-50 to-white">
            {/* Icon Badge with Animation */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-600 to-green-600 rounded-full mb-6 shadow-2xl shadow-orange-500/50 animate-bounce-slow">
              <Shield className="text-white" size={48} />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-blue-900 mb-3">Admin Login</h1>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent via-orange-500 to-orange-600 rounded-full"></div>
              <Sparkles className="text-orange-400" size={20} />
              <div className="h-1 w-16 bg-gradient-to-r from-green-600 via-green-500 to-transparent rounded-full"></div>
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 font-semibold">Gram Panchayat Management System</p>

            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 shadow-md">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700 font-semibold">Secure Access</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-8">
              <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4 flex items-start gap-3 shadow-lg">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Login Failed</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                <Mail size={18} className="text-orange-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all bg-gradient-to-r from-orange-50/50 to-green-50/50 hover:border-orange-400 text-gray-900 font-medium"
                placeholder="admin@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-2">
                <Lock size={18} className="text-green-600" />
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all bg-gradient-to-r from-green-50/50 to-orange-50/50 hover:border-green-400 text-gray-900 font-medium"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <LogIn size={24} />
              <span className="text-lg">{loading ? 'Logging in...' : 'Login to Admin Panel'}</span>
              {!loading && <Sparkles size={20} className="animate-pulse" />}
            </button>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                <span className="text-sm font-semibold">Authenticating...</span>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 text-sm mb-1">Authorized Personnel Only</h3>
                  <p className="text-xs text-gray-600">
                    This portal is restricted to authorized Gram Panchayat administrators. 
                    Unauthorized access is prohibited and may be subject to legal action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Commented out: Create Admin Account Section */}
          {/* 
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-gray-500">
              Create admin account at:{' '}
              <a href="/firebase-setup" className="text-primary-600 hover:text-primary-700 font-semibold">
                Firebase Setup
              </a>
            </p>
          </div>
          */}
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-white/80 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Government of India Initiative</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
