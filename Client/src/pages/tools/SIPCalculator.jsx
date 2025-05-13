import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SIPCalculator = ({ darkMode, setDarkMode }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    monthlyInvestment: 5000,
    expectedReturnRate: 12,
    timePeriod: 10
  });
  
  const [results, setResults] = useState({
    totalInvestment: 0,
    estimatedReturns: 0,
    totalValue: 0,
    yearlyData: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Calculate SIP returns
  useEffect(() => {
    const { monthlyInvestment, expectedReturnRate, timePeriod } = formData;
    
    // Monthly rate
    const monthlyRate = expectedReturnRate / 12 / 100;
    
    // Calculate total months
    const totalMonths = timePeriod * 12;
    
    // Calculate future value using SIP formula
    // FV = P × ((1 + r)^n - 1) / r × (1 + r)
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    
    // Calculate total investment
    const totalInvestment = monthlyInvestment * totalMonths;
    
    // Calculate estimated returns
    const estimatedReturns = futureValue - totalInvestment;
    
    // Generate yearly data for chart
    const yearlyData = [];
    for (let year = 1; year <= timePeriod; year++) {
      const months = year * 12;
      const yearlyValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const yearlyInvestment = monthlyInvestment * months;
      const yearlyReturns = yearlyValue - yearlyInvestment;
      
      yearlyData.push({
        year,
        investment: Math.round(yearlyInvestment),
        returns: Math.round(yearlyReturns),
        totalValue: Math.round(yearlyValue)
      });
    }
    
    setResults({
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(futureValue),
      yearlyData
    });
  }, [formData]);

  // Chart data
  const chartData = {
    labels: results.yearlyData.map(data => `Year ${data.year}`),
    datasets: [
      {
        label: 'Total Investment',
        data: results.yearlyData.map(data => data.investment),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Estimated Value',
        data: results.yearlyData.map(data => data.totalValue),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'SIP Investment Growth',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  return (
    <div className="page-container relative">
      {/* Header/Navigation */}
      <header className="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-xl sm:text-2xl font-bold text-primary dark:text-white hover:text-secondary dark:hover:text-accent transition-colors duration-200">NiveshPath</Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="theme-toggle-btn"
                aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <Link to="/profile" className="nav-link flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button 
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-2 space-y-1 border-t border-gray-200 dark:border-gray-700">
              <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent">
                Dashboard
              </Link>
              <Link to="/tools/emi-calculator" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent">
                EMI Calculator
              </Link>
              <Link to="/tools/budget-planner" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-secondary dark:hover:text-accent">
                Budget Planner
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="content-container pb-16 sm:pb-8"> {/* Added padding bottom for mobile nav */}
        <div className="mb-6 sm:mb-8">
          <h2 className="section-title text-2xl sm:text-3xl">SIP Calculator</h2>
          <p className="section-description text-responsive">
            Calculate the future value of your SIP investments and plan your financial goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-medium text-primary dark:text-white mb-3 sm:mb-4">Enter your SIP details</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="monthlyInvestment" className="form-label text-xs sm:text-sm">
                    Monthly Investment (₹)
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      id="monthlyInvestment"
                      name="monthlyInvestment"
                      value={formData.monthlyInvestment}
                      onChange={handleChange}
                      min="500"
                      max="1000000"
                      className="input-field text-sm py-2 sm:py-3"
                    />
                  </div>
                  <div className="mt-1 sm:mt-2">
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={formData.monthlyInvestment}
                      onChange={handleChange}
                      name="monthlyInvestment"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>₹500</span>
                      <span>₹100,000</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="expectedReturnRate" className="form-label text-xs sm:text-sm">
                  Expected Annual Return (%)
                </label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    id="expectedReturnRate"
                    name="expectedReturnRate"
                    value={formData.expectedReturnRate}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    step="0.1"
                    className="input-field text-sm py-2 sm:py-3"
                  />
                </div>
                  <div className="mt-1 sm:mt-2">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.5"
                      value={formData.expectedReturnRate}
                      onChange={handleChange}
                      name="expectedReturnRate"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>1%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="timePeriod" className="form-label text-xs sm:text-sm">
                    Time Period (in years)
                  </label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      id="timePeriod"
                      name="timePeriod"
                      value={formData.timePeriod}
                      onChange={handleChange}
                      min="1"
                      max="40"
                      className="input-field text-sm py-2 sm:py-3"
                    />
                  </div>
                  <div className="mt-1 sm:mt-2">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={formData.timePeriod}
                      onChange={handleChange}
                      name="timePeriod"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>1 year</span>
                      <span>40 years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="card p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-medium text-primary dark:text-white mb-3 sm:mb-4">Results Summary</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Investment</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary dark:text-white">₹{results.totalInvestment.toLocaleString('en-IN')}</p>
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Estimated Returns</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">₹{results.estimatedReturns.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Estimated Value</p>
                  <p className="text-2xl sm:text-3xl font-bold text-secondary">₹{results.totalValue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-2">
            <div className="card p-3 sm:p-6 mb-3 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-medium text-primary dark:text-white mb-2 sm:mb-4">Your SIP Results</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Investment</p>
                  <p className="text-base sm:text-2xl font-bold text-primary dark:text-white">₹{results.totalInvestment.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated Returns</p>
                  <p className="text-base sm:text-2xl font-bold text-green-600">₹{results.estimatedReturns.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
                  <p className="text-base sm:text-2xl font-bold text-secondary">₹{results.totalValue.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-48 sm:h-60 md:h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            
            {/* Yearly Breakdown */}
            <div className="card p-3 sm:p-6">
              <h3 className="text-lg sm:text-xl font-medium text-primary dark:text-white mb-2 sm:mb-4">Year-by-Year Breakdown</h3>
              
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-2 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                      <th className="px-2 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Investment</th>
                      <th className="px-2 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interest</th>
                      <th className="px-2 sm:px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {results.yearlyData.map((data, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                        <td className="px-2 sm:px-6 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">Year {data.year}</td>
                        <td className="px-2 sm:px-6 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">₹{data.investment.toLocaleString('en-IN')}</td>
                        <td className="px-2 sm:px-6 py-2 whitespace-nowrap text-xs text-green-600">₹{data.returns.toLocaleString('en-IN')}</td>
                        <td className="px-2 sm:px-6 py-2 whitespace-nowrap text-xs font-medium text-secondary">₹{data.totalValue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-primary shadow-lg border-t border-gray-200 dark:border-gray-800 py-2 px-4 flex justify-around items-center z-20">
        <Link to="/dashboard" className="mobile-nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </Link>
        <Link to="/tools/emi-calculator" className="mobile-nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>EMI</span>
        </Link>
        <Link to="/tools/budget-planner" className="mobile-nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Budget</span>
        </Link>
        <Link to="/profile" className="mobile-nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default SIPCalculator;