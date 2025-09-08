
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ToolPageLayout from '../components/ToolPageLayout';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromState = location.state as { from?: Location; toolName?: string } | null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Mock sign-in logic
    const from = fromState?.from?.pathname || '/';
    signIn(email);
    navigate(from, { replace: true });
  };

  return (
    <ToolPageLayout title="Sign In" description="Access your QUANZAB Toolkit account.">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {fromState?.toolName && (
            <div className="mb-4 p-4 bg-primary/10 border-l-4 border-primary text-primary/80 rounded-r-lg">
              <p className="font-bold">Access Premium Feature</p>
              <p>Please sign in to use the "{fromState.toolName}" tool.</p>
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-gray-300">Email address</label>
            <div className="mt-1">
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-transparent dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-gray-300">Password</label>
            <div className="mt-1">
              <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-transparent dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 focus:ring-2 focus:ring-primary shadow-sm dark:shadow-none" />
            </div>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-primary hover:bg-opacity-90">
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </ToolPageLayout>
  );
};

export default SignInPage;
