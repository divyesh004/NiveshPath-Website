import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { CURRENCY_API_ENABLED } from '../config';

const CurrencyRates = () => {
  const [currencyData, setCurrencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        setLoading(true);
        
        // Check if currency API is enabled in configuration
        if (!CURRENCY_API_ENABLED) {
          throw new Error('Currency API is disabled in configuration');
        }
        
        const response = await apiService.external.getCurrencyRates();
      
        if (response.data && response.data.success) {
          // Transform API response to the format needed for display
          const apiData = response.data.data;
          const rates = apiData.rates;
          const changes = apiData.changes || {};
          
          // Create formatted data array from rates object with actual change percentages
          const formattedData = [
            { 
              code: 'USD', 
              name: 'US Dollar', 
              rate: parseFloat((1/rates.USD).toFixed(2)), 
              change: changes.USD || 0, 
              isPositive: (changes.USD || 0) >= 0 
            },
            { 
              code: 'EUR', 
              name: 'Euro', 
              rate: parseFloat((1/rates.EUR).toFixed(2)), 
              change: changes.EUR || 0, 
              isPositive: (changes.EUR || 0) >= 0 
            },
            { 
              code: 'GBP', 
              name: 'British Pound', 
              rate: parseFloat((1/rates.GBP).toFixed(2)), 
              change: changes.GBP || 0, 
              isPositive: (changes.GBP || 0) >= 0 
            },
            { 
              code: 'JPY', 
              name: 'Japanese Yen', 
              rate: parseFloat((1/rates.JPY).toFixed(2)), 
              change: changes.JPY || 0, 
              isPositive: (changes.JPY || 0) >= 0 
            },
          ];
          
          setCurrencyData(formattedData);
          setError(null);
          return; // Exit early after successful API call
        } else {
          throw new Error('Invalid data received from API');
        }
      } catch (err) {
        setError('Problem retrieving data from API');
        // Set fallback data with clear indication it's not from API
        setCurrencyData([
          { code: 'USD', name: 'US Dollar', rate: 83.12, change: -0.15, isPositive: false, isFallback: true },
          { code: 'EUR', name: 'Euro', rate: 89.75, change: 0.22, isPositive: true, isFallback: true },
          { code: 'GBP', name: 'British Pound', rate: 105.32, change: 0.18, isPositive: true, isFallback: true },
          { code: 'JPY', name: 'Japanese Yen', rate: 0.55, change: -0.08, isPositive: false, isFallback: true },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrencyRates();
  }, []);

  return (
    <div className="mb-8 sm:mb-10">
      <h3 className="text-lg font-medium text-primary dark:text-white mb-3 sm:mb-4">Currency Rates</h3>
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400 text-responsive">Loading currency data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500 text-responsive">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : currencyData.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400 text-responsive">No currency data available. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {currencyData.some(currency => currency.isFallback) && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
              <p className="text-sm">⚠️ Problem retrieving data from API. Displaying temporary data.</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-2">
            {currencyData.map((currency, index) => (
              <div key={index} className={`card p-3 sm:p-4 ${currency.isFallback ? 'border border-yellow-400 dark:border-yellow-600' : ''}`}>
                <div className="flex justify-between items-center">
                  <h4 className="text-primary dark:text-white font-medium text-sm sm:text-base">{currency.code}</h4>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{currency.name}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-lg sm:text-xl font-bold text-primary dark:text-white">₹{currency.rate.toFixed(2)}</p>
                  <span className={`text-xs sm:text-sm ${currency.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {currency.isPositive ? '+' : ''}{parseFloat(currency.change).toFixed(2)}%
                  </span>
                </div>
                {currency.isFallback && (
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    (Temporary Data)
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencyRates;