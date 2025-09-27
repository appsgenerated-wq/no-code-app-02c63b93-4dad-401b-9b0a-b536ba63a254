import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import './index.css';

const manifest = new Manifest();

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('landing');

  useEffect(() => {
    const checkConnectionAndSession = async () => {
      try {
        console.log('🚀 [APP] Starting backend connection test...');
        const healthResponse = await fetch('/api/health');
        if (healthResponse.ok) {
          setBackendConnected(true);
          console.log('✅ [APP] Backend connection successful.');
          // Session check
          const currentUser = await manifest.from('User').me();
          if (currentUser) {
            setUser(currentUser);
            setCurrentScreen('dashboard');
          }
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        console.error('❌ [APP] Backend connection or session check failed:', error);
        setBackendConnected(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnectionAndSession();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const currentUser = await manifest.from('User').me();
      setUser(currentUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  const handleSignup = async (name, email, password, role) => {
    try {
      await manifest.from('User').signup({ name, email, password, role });
      await handleLogin(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. The email might already be in use.');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading Application...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm text-gray-600 font-medium">
          {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
        </span>
      </div>
      
      {currentScreen === 'dashboard' && user ? (
        <DashboardPage user={user} onLogout={handleLogout} manifest={manifest} />
      ) : (
        <LandingPage onLogin={handleLogin} onSignup={handleSignup} />
      )}
    </div>
  );
}

export default App;
