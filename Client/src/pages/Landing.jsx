import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Landing = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white dark:bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary dark:text-white">NiveshPath</h1>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary dark:text-white hover:text-secondary">
                Login
              </Link>
              <button onClick={handleGetStarted} className="btn">
                Get Started
              </button>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary">
                Login
              </Link>
              <button onClick={handleGetStarted} className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-secondary rounded-md">
                Get Started
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full text-left px-3 py-2 text-base font-medium text-primary hover:text-secondary"
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-background dark:bg-dark-bg py-8 sm:py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="text-center lg:text-left sm:mx-auto md:max-w-2xl lg:col-span-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-primary dark:text-white">
                <span className="block">Your AI-Powered</span>
                <span className="block text-secondary">Financial Guide</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 sm:mt-5 md:mt-5 lg:mx-0">
                NiveshPath helps you make smarter financial decisions with AI-powered tools, personalized advice, and easy-to-use calculators.
              </p>
              <div className="mt-6 sm:mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button onClick={handleGetStarted} className="btn inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                  Get Started
                  <svg className="ml-2 -mr-1 w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-10 sm:mt-12 lg:mt-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center p-2 bg-secondary rounded-md shadow-lg">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900 dark:text-white">Financial Tools</h2>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">SIP Calculator, EMI Calculator, Budget Planner</p>
                    </div>
                    <div className="mt-6 sm:mt-8 text-center">
                      <div className="inline-flex items-center justify-center p-2 bg-accent rounded-md shadow-lg">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900 dark:text-white">AI Chatbot</h2>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">Get personalized financial advice instantly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-secondary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-extrabold tracking-tight text-primary dark:text-white">
              Everything you need for financial planning
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="space-y-8 sm:space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-6 md:gap-y-8 lg:gap-x-8">
              {/* Feature 1 */}
              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-secondary text-white">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mt-4 sm:mt-5">
                  <h3 className="text-base sm:text-lg font-medium text-primary dark:text-white">Financial Calculators</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Plan your investments with our SIP calculator, calculate loan EMIs, and manage your budget effectively.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-secondary text-white">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="mt-4 sm:mt-5">
                  <h3 className="text-base sm:text-lg font-medium text-primary dark:text-white">AI-Powered Chatbot</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Get instant answers to your financial questions with our AI chatbot trained on financial knowledge.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-secondary text-white">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="mt-4 sm:mt-5">
                  <h3 className="text-base sm:text-lg font-medium text-primary dark:text-white">Live Market Data</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Stay updated with real-time market data from RBI, NSE/BSE, and currency exchange rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <p className="text-center text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} NiveshPath. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:order-1">
              <p className="text-center text-xs sm:text-sm md:text-left">
                Designed with ❤️ for financial education
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;