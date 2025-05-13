import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    age: '',
    occupation: '',
    monthlyIncome: '',
    education: '',
    familySize: 1,
    location: '',
    phone: '',
    
    // Financial Goals
    shortTermGoals: [],
    longTermGoals: [],
    riskTolerance: 'medium', // very_low, low, medium, high, very_high
    investmentTimeframe: 'medium_term', // short_term, medium_term, long_term
    
    // Existing Investments
    hasExistingInvestments: false,
    investmentTypes: [],
    
    // Financial Knowledge
    knowledgeLevel: 'beginner', // beginner, intermediate, advanced
    
    // Psychological Profile
    financialAnxiety: 'medium', // low, medium, high
    decisionMakingStyle: 'analytical', // analytical, intuitive, consultative, spontaneous
    
    // Cultural Background
    culturalBackground: '',
    financialBeliefs: [],
    communityInfluence: 'medium', // low, medium, high
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'hasExistingInvestments') {
        setFormData(prev => {
          // If user is checking the box and investmentTypes is empty, initialize with an empty array
          // Otherwise keep the current value or reset to empty array when unchecking
          const updatedInvestmentTypes = checked 
            ? (Array.isArray(prev.investmentTypes) && prev.investmentTypes.length > 0 
                ? prev.investmentTypes 
                : []) 
            : [];
            
          return {
            ...prev,
            [name]: checked,
            investmentTypes: updatedInvestmentTypes
          };
        });
      } else if (name.startsWith('investmentTypes-')) {
        // Handle investment types checkboxes specifically
        const investmentType = name.split('-')[1]; // Extract investment type value
        
        setFormData(prev => {
          // Ensure we're working with an array
          const currentInvestmentTypes = Array.isArray(prev.investmentTypes) ? [...prev.investmentTypes] : [];
          
          if (checked) {
            // Add to array if checked
            return {
              ...prev,
              investmentTypes: [...currentInvestmentTypes, investmentType]
            };
          } else {
            // Remove from array if unchecked
            return {
              ...prev,
              investmentTypes: currentInvestmentTypes.filter(item => item !== investmentType)
            };
          }
        });
      } else {
        // Handle other array of checkboxes (goals, financialBeliefs)
        const arrayName = name.split('-')[0]; // Extract array name from checkbox name
        const checkboxValue = name.split('-')[1]; // Extract value
        
        setFormData(prev => {
          const currentArray = Array.isArray(prev[arrayName]) ? [...prev[arrayName]] : [];
          
          if (checked) {
            // Add to array if checked
            return {
              ...prev,
              [arrayName]: [...currentArray, checkboxValue]
            };
          } else {
            // Remove from array if unchecked
            return {
              ...prev,
              [arrayName]: currentArray.filter(item => item !== checkboxValue)
            };
          }
        });
      }
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.age || !formData.monthlyIncome) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }
      
      // Prepare data for API submission
      const profileData = {
        name: formData.name,
        age: parseInt(formData.age),
        income: parseInt(formData.monthlyIncome),
        goals: [...formData.shortTermGoals, ...formData.longTermGoals],
        investmentTimeframe: formData.investmentTimeframe,
        riskTolerance: formData.riskTolerance,
        // Always include existingInvestments, but as empty array if user has none
        // Make sure we're using the correct array of investment types
        existingInvestments: formData.hasExistingInvestments && Array.isArray(formData.investmentTypes) && formData.investmentTypes.length > 0 
          ? formData.investmentTypes 
          : [],
        knowledgeAssessment: {
          financialKnowledgeLevel: formData.knowledgeLevel
        },
        // Structure data according to backend expectations
        demographic: {
          location: formData.location || '',
          occupation: formData.occupation || '',
          education: formData.education || '',
          familySize: parseInt(formData.familySize) || 1,
          phone: formData.phone || ''
        },
        psychological: {
          riskTolerance: formData.riskTolerance || 'medium',
          financialAnxiety: formData.financialAnxiety || 'medium',
          decisionMakingStyle: formData.decisionMakingStyle || 'analytical'
        },
        ethnographic: {
          culturalBackground: formData.culturalBackground || '',
          financialBeliefs: formData.financialBeliefs || [],
          communityInfluence: formData.communityInfluence || 'medium'
        }
      };
      
      // Debug logs to check what's happening
     
      // Additional check to ensure investment types are properly set when user has existing investments
      if (formData.hasExistingInvestments && (!Array.isArray(profileData.existingInvestments) || profileData.existingInvestments.length === 0)) {
        // If user checked they have investments but didn't select any types, show an error
        toast.warning('You indicated that you have investments, please select investment types');
        setLoading(false);
        return;
      }
      
      // Send data to the backend using API service
      const response = await apiService.onboarding.submitOnboarding(profileData);
    
      toast.success('Profile created successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      toast.error('Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render different form steps based on currentStep
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-primary dark:text-white">Personal Information</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Dynamic Personal Information Fields */}
              {[
                { id: 'name', label: 'Name', type: 'text' },
                { id: 'age', label: 'Age', type: 'number' },
                { id: 'occupation', label: 'Occupation', type: 'text' },
                { id: 'education', label: 'Education', type: 'text' },
                { id: 'location', label: 'Location', type: 'text' },
                { id: 'phone', label: 'Phone Number', type: 'tel' },
                { id: 'familySize', label: 'Family Size', type: 'number', min: '1' },
                { id: 'monthlyIncome', label: 'Monthly Income (₹)', type: 'number' }
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    className="input-field mt-1"
                    min={field.min}
                    required
                  />
                </div>
              ))}
              
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-primary dark:text-white">Financial Goals</h3>
            
            {/* Dynamic Goals Section */}
            {[
              { 
                id: 'shortTermGoals', 
                label: 'Short-term Goals (1-3 years)',
                options: ['Emergency Fund', 'Vacation', 'Education', 'Vehicle', 'Home Appliances', 'Debt Repayment', 'Wedding']
              },
              { 
                id: 'longTermGoals', 
                label: 'Long-term Goals (3+ years)',
                options: ['Retirement', 'Home Purchase', 'Children Education', 'Wealth Building', 'Starting Business', 'Foreign Travel', 'Financial Independence']
              }
            ].map(goalGroup => (
              <div key={goalGroup.id}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{goalGroup.label}</label>
                <div className="space-y-2">
                  {goalGroup.options.map(goal => (
                    <div key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${goalGroup.id}-${goal}`}
                        name={`${goalGroup.id}-${goal}`}
                        checked={formData[goalGroup.id].includes(goal)}
                        onChange={handleChange}
                        className="h-4 w-4 text-secondary focus:ring-accent border-gray-300 rounded"
                      />
                      <label htmlFor={`${goalGroup.id}-${goal}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            
            <div>
              <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Risk Tolerance</label>
              <select
                id="riskTolerance"
                name="riskTolerance"
                value={formData.riskTolerance}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="very_low">Very Low - I want maximum safety with minimal risk</option>
                <option value="low">Low - I prefer stable investments with lower returns</option>
                <option value="medium">Medium - I can accept some fluctuations for better returns</option>
                <option value="high">High - I'm comfortable with significant fluctuations for potentially higher returns</option>
                <option value="very_high">Very High - I can tolerate extreme market fluctuations for maximum returns</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="investmentTimeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Investment Timeframe</label>
              <select
                id="investmentTimeframe"
                name="investmentTimeframe"
                value={formData.investmentTimeframe}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="short_term">Short Term (1-3 years)</option>
                <option value="medium_term">Medium Term (3-7 years)</option>
                <option value="long_term">Long Term (7+ years)</option>
              </select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-primary dark:text-white">Investment Experience</h3>
            
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasExistingInvestments"
                  name="hasExistingInvestments"
                  checked={formData.hasExistingInvestments}
                  onChange={handleChange}
                  className="h-4 w-4 text-secondary focus:ring-accent border-gray-300 rounded"
                />
                <label htmlFor="hasExistingInvestments" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  I have existing investments
                </label>
              </div>
            </div>
            
            {formData.hasExistingInvestments && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Types</label>
                <div className="space-y-2">
                  {[
                    'Stocks', 
                    'Mutual Funds', 
                    'Fixed Deposits', 
                    'Real Estate', 
                    'Gold', 
                    'PPF/EPF', 
                    'Cryptocurrency',
                    'NPS',
                    'Bonds',
                    'Insurance Policies'
                  ].map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`investmentTypes-${type}`}
                        name={`investmentTypes-${type}`}
                        checked={formData.investmentTypes.includes(type)}
                        onChange={handleChange}
                        className="h-4 w-4 text-secondary focus:ring-accent border-gray-300 rounded"
                      />
                      <label htmlFor={`investmentTypes-${type}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="knowledgeLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Financial Knowledge Level</label>
              <select
                id="knowledgeLevel"
                name="knowledgeLevel"
                value={formData.knowledgeLevel}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="beginner">Beginner - I'm new to investing</option>
                <option value="intermediate">Intermediate - I understand basic investment concepts</option>
                <option value="advanced">Advanced - I'm experienced with various investment vehicles</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-primary dark:text-white">Psychological & Cultural Profile</h3>
            
            {/* Dynamic Dropdowns for Psychological Profile */}
            {[
              { 
                id: 'financialAnxiety', 
                label: 'Financial Anxiety Level',
                options: [
                  { value: 'low', label: 'Low - I rarely worry about finances' },
                  { value: 'medium', label: 'Medium - I sometimes worry about finances' },
                  { value: 'high', label: 'High - I frequently worry about finances' }
                ]
              },
              { 
                id: 'decisionMakingStyle', 
                label: 'Decision Making Style',
                options: [
                  { value: 'analytical', label: 'Analytical - I make decisions based on data and research' },
                  { value: 'intuitive', label: 'Intuitive - I trust my gut feeling' },
                  { value: 'consultative', label: 'Consultative - I seek advice from others' },
                  { value: 'spontaneous', label: 'Spontaneous - I make quick decisions' }
                ]
              },
              { 
                id: 'communityInfluence', 
                label: 'Community Influence on Financial Decisions',
                options: [
                  { value: 'low', label: 'Low - I make decisions independently' },
                  { value: 'medium', label: 'Medium - I consider community opinions' },
                  { value: 'high', label: 'High - Community values strongly influence my decisions' }
                ]
              }
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                <select
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  {field.options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            ))}
            
            <div>
              <label htmlFor="culturalBackground" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cultural Background</label>
              <input
                type="text"
                id="culturalBackground"
                name="culturalBackground"
                value={formData.culturalBackground}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Financial Beliefs</label>
              <div className="space-y-2">
                {[
                  'Saving is important', 
                  'Investing is risky', 
                  'Financial security is priority', 
                  'Wealth creation takes time', 
                  'Money should be enjoyed',
                  'Debt should be avoided',
                  'Financial education is essential'
                ].map(belief => (
                  <div key={belief} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`financialBeliefs-${belief}`}
                      name={`financialBeliefs-${belief}`}
                      checked={formData.financialBeliefs.includes(belief)}
                      onChange={handleChange}
                      className="h-4 w-4 text-secondary focus:ring-accent border-gray-300 rounded"
                    />
                    <label htmlFor={`financialBeliefs-${belief}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      {belief}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-bg py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 card p-5 sm:p-6 md:p-8">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-primary dark:text-white">
            Tell us about yourself
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            This helps us personalize your investment experience
          </p>
          
          {/* Progress indicator */}
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${currentStep >= step ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                  >
                    {step}
                  </div>
                  <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {step === 1 ? 'Personal' : step === 2 ? 'Goals' : step === 3 ? 'Experience' : 'Psychological'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-1 bg-secondary" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <form onSubmit={currentStep === 4 ? handleSubmit : e => { e.preventDefault(); nextStep(); }}>
          <div className="mt-6 sm:mt-8">
            {renderStep()}
            
            <div className="mt-6 sm:mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`btn text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2 ${currentStep === 1 ? 'ml-auto' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : currentStep < 4 ? 'Next' : 'Complete'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;