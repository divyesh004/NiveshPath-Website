import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const { onboardingCompleted, updateOnboardingStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(0); // Start at welcome screen (0)
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [character, setCharacter] = useState('owl');
  const [characterMessage, setCharacterMessage] = useState('Welcome! Let\'s set up your financial profile.');
  const [typingEffect, setTypingEffect] = useState(true);
  const [confetti, setConfetti] = useState(false);
  
  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await apiService.onboarding.getOnboardingStatus();
        if (response.data && response.data.completed) {
          // User has already completed onboarding, redirect to dashboard
          toast.info('आपने पहले ही ऑनबोर्डिंग पूरा कर लिया है');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, [navigate]);
  
  // Calculate progress percentage based on current step (excluding welcome screen)
  const progress = currentStep > 0 ? ((currentStep - 1) / 4) * 100 : 0;
  
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
    // Play sound effect (optional)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio play prevented:', e));
    
    // Reset animation for character
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 50);
    
    // Update character message based on next step
    updateCharacterMessage(currentStep + 1);
    
    // Move to next step with animation
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    // Play sound effect (optional - different sound for back)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio play prevented:', e));
    
    // Reset animation for character
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 50);
    
    // Update character message based on previous step
    updateCharacterMessage(currentStep - 1);
    
    // Move to previous step with animation
    setCurrentStep(prev => prev - 1);
  };
  
  // Update character message based on current step
  const updateCharacterMessage = (step) => {
    setTypingEffect(false); // Reset typing effect
    
    let message = '';
    switch(step) {
      case 0:
        message = 'Welcome! Let\'s set up your financial profile.';
        setCharacter('owl');
        break;
      case 1:
        message = 'Great! Let\'s start with some basic information about you.';
        setCharacter('owl');
        break;
      case 2:
        message = 'Now, tell me about your financial goals. What are you saving for?';
        setCharacter('fox');
        break;
      case 3:
        message = 'Do you have any investment experience? No worries if you don\'t!';
        setCharacter('owl');
        break;
      case 4:
        message = 'Last step! Let\'s understand your financial personality better.';
        setCharacter('fox');
        break;
      case 5:
        message = 'Amazing job! You\'re all set to start your financial journey!';
        setCharacter('owl');
        setConfetti(true);
        break;
      default:
        message = 'Let\'s continue with your financial profile.';
    }
    
    setCharacterMessage(message);
    setTimeout(() => setTypingEffect(true), 100); // Re-enable typing effect
  };
  
  // Effect to handle confetti animation
  useEffect(() => {
    if (confetti) {
      // Auto-disable confetti after 3 seconds
      const timer = setTimeout(() => setConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confetti]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.age || !formData.monthlyIncome) {
        toast.error('Please fill all required fields');
        setCharacterMessage('Oops! Please fill in all the required fields before we continue.');
        setShowAnimation(false);
        setTimeout(() => setShowAnimation(true), 50);
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
    
      // Show success screen with confetti
      updateCharacterMessage(5);
      setCurrentStep(5);
      
      // Update onboarding status in AuthContext
      updateOnboardingStatus(true);
      
      // Navigate after a short delay to show the success screen
      setTimeout(() => {
        toast.success('Profile created successfully!');
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render different form steps based on currentStep
  const renderStep = () => {
    switch(currentStep) {
      case 0: // Welcome Screen
        return (
          <div className="bg-background-pro min-h-[300px] flex flex-col justify-center items-center text-center p-6 rounded-xl">
            <h1 className="text-4xl font-bold text-primary-pro">Welcome to Your Finance Journey 🚀</h1>
            <p className="text-text-pro mt-4">We'll guide you step-by-step to better understand your finances.</p>
            <button 
              onClick={nextStep}
              className="mt-6 bg-secondary-pro hover:bg-accent-pro text-white px-6 py-3 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              Let's Go
            </button>
          </div>
        );
        
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
  
  // Render success screen (final step)
  const renderSuccessScreen = () => {
    return (
      <div className="bg-gradient-to-r from-background-pro to-[#e7f9f7] min-h-[300px] flex flex-col justify-center items-center text-center p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-primary-pro">🎉 Profile Created Successfully!</h1>
        <p className="text-accent-pro text-xl mt-4">You're all set to start your financial journey!</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-6 bg-secondary-pro hover:bg-accent-pro text-white px-6 py-3 rounded-lg text-lg transition-all transform hover:scale-105"
        >
          Start Planning
        </button>
      </div>
    );
  };
  
  // Render motivational feedback screen
  const renderFeedbackScreen = (message, emoji) => {
    return (
      <div className="bg-gradient-to-r from-background-pro to-[#e7f9f7] p-6 rounded-xl text-center">
        <p className="text-accent-pro text-xl">{emoji} {message}</p>
        <button 
          onClick={nextStep}
          className="mt-6 bg-secondary-pro hover:bg-accent-pro text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
        >
          Continue
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-pro dark:bg-dark-bg py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {confetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
              }}
            />
          ))}
        </div>
      )}
      
      <div className={`max-w-md w-full space-y-6 sm:space-y-8 card p-5 sm:p-6 md:p-8 onboarding-container ${showAnimation ? 'animate-slide' : ''}`}>
        {/* Character mascot */}
        <div className="character-container">
          <div className={`character ${character} ${showAnimation ? 'character-bounce' : ''}`}>
            <div className="character-speech-bubble">
              <span className={typingEffect ? 'typing-effect' : ''}>{characterMessage}</span>
            </div>
          </div>
        </div>
        
        {currentStep > 0 && currentStep < 5 && (
          <div>
            <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-primary-pro dark:text-white">
              {currentStep === 1 ? 'Tell us about yourself' : 
               currentStep === 2 ? 'Your Financial Goals' :
               currentStep === 3 ? 'Investment Experience' :
               'Your Financial Personality'}
            </h2>
            <p className="mt-2 text-center text-xs sm:text-sm text-text-pro dark:text-gray-400">
              {currentStep === 1 ? 'This helps us personalize your investment experience' : 
               currentStep === 2 ? 'What are you saving for?' :
               currentStep === 3 ? 'No worries if you\'re just starting out' :
               'Understanding how you think about money'}
            </p>
            
            {/* Progress dots - Duolingo style */}
            <div className="flex gap-2 justify-center mt-4">
              {[1, 2, 3, 4].map(step => (
                <span 
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentStep === step 
                      ? 'bg-secondary-pro scale-125' 
                      : currentStep > step 
                        ? 'bg-secondary-pro' 
                        : 'bg-background-pro border border-secondary-pro'
                  }`}
                />
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-secondary-pro rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <div className={`form-step-container ${showAnimation ? 'form-fade' : ''}`}>
            {currentStep === 5 ? renderSuccessScreen() : renderStep()}
          </div>
          
          {currentStep > 0 && currentStep < 5 && (
            <div className="flex justify-between mt-6 sm:mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-background-pro border border-secondary-pro hover:bg-gray-100 text-secondary-pro px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-secondary-pro hover:bg-accent-pro text-white px-6 py-3 rounded-lg transition-all ml-auto flex items-center gap-2 group"
                  disabled={loading}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-secondary-pro hover:bg-accent-pro text-white px-6 py-3 rounded-lg transition-all ml-auto flex items-center gap-2 group"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Submit'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;