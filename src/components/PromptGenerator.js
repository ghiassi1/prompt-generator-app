'use client'

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Copy, RotateCcw } from 'lucide-react';

const PromptGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState({
    role: '',
    goal: '',
    context: '',
    audience: '',
    constraints: '',
    style: '',
    finalPrompt: '',
    optimizedPrompt: ''
  });
  const [copied, setCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Role",
      question: "What is the role?",
      description: "Define the specific expertise, profession, or persona. This establishes the knowledge base and perspective for responses.",
      checklist: [
        "What subject matter expertise is needed?",
        "What professional background would be most helpful?",
        "What credentials or qualifications should be implied?",
        "What industry knowledge is required?",
        "What level of authority should the role have?"
      ],
      dropdown: [
        "Medical Educator",
        "Financial Advisor",
        "Compliance Officer",
        "Data Analyst",
        "Creative Writing Coach",
        "Technical Writer",
        "Legal Consultant",
        "HR Specialist",
        "Marketing Strategist",
        "Project Manager",
        "Academic Researcher",
        "Customer Service Representative",
        "Training Coordinator",
        "Business Analyst",
        "Quality Assurance Specialist",
        "Content Creator",
        "Sales Coach",
        "Operations Manager",
        "IT Support Specialist",
        "Healthcare Administrator"
      ],
      placeholder: "Select from dropdown or type your own role",
      key: 'role'
    },
    {
      id: 2,
      title: "Goal",
      question: "What is the main task or outcome you want to achieve?",
      description: "Clearly state the primary objective. Be specific about what success looks like.",
      checklist: [
        "What is the specific end result you want?",
        "What problem needs to be solved?",
        "What information needs to be communicated?",
        "What action should the user take after?",
        "How will you measure success?"
      ],
      placeholder: "e.g., explain complex medical procedures in simple terms, teach budgeting basics to newcomers, review documents for regulatory compliance",
      key: 'goal'
    },
    {
      id: 3,
      title: "Context",
      question: "What is the sector and situational background?",
      description: "Provide the industry, environment, or setting where this will be used.",
      checklist: [
        "What industry or sector is this for?",
        "What is the organizational setting?",
        "What external factors influence this situation?",
        "What time constraints or urgency exists?",
        "What resources are available or limited?"
      ],
      dropdown: [
        "Healthcare & Medical",
        "Education & Training",
        "Financial Services",
        "Technology & Software",
        "Legal & Compliance",
        "Human Resources",
        "Marketing & Advertising",
        "Manufacturing & Operations",
        "Retail & E-commerce",
        "Government & Public Sector",
        "Non-profit & Social Services",
        "Real Estate",
        "Consulting Services",
        "Media & Entertainment",
        "Transportation & Logistics",
        "Energy & Utilities",
        "Agriculture & Food",
        "Construction & Engineering",
        "Hospitality & Tourism",
        "Research & Development"
      ],
      placeholder: "Select from dropdown or describe your sector/context",
      key: 'context'
    },
    {
      id: 4,
      title: "Audience",
      question: "Who is the target audience and what are their constraints?",
      description: "Specify audience characteristics that affect communication style and content.",
      checklist: [
        "What is their age group and education level?",
        "What is their technical expertise?",
        "What cultural considerations apply?",
        "What language or accessibility needs exist?",
        "What prior knowledge can you assume?"
      ],
      dropdown: [
        "Children (ages 5-12)",
        "Teenagers (ages 13-18)",
        "College students",
        "Young professionals (20s-30s)",
        "Mid-career professionals (30s-50s)",
        "Senior executives",
        "Retirees/elderly",
        "Low health literacy adults",
        "Non-native English speakers",
        "Technical professionals",
        "General public",
        "Industry specialists",
        "Beginner learners",
        "Intermediate learners",
        "Advanced practitioners",
        "People with disabilities",
        "Low-income communities",
        "Rural populations",
        "Urban professionals",
        "Remote workers"
      ],
      placeholder: "Select from dropdown or describe your audience",
      key: 'audience'
    },
    {
      id: 5,
      title: "Constraints & Ethics",
      question: "What ethical guardrails, limitations, or exclusions must apply?",
      description: "Define boundaries, restrictions, and ethical considerations that must be followed.",
      checklist: [
        "What should absolutely NOT be done?",
        "What legal or regulatory requirements apply?",
        "What professional standards must be maintained?",
        "What safety considerations are important?",
        "What biases or sensitive topics need special care?"
      ],
      placeholder: "e.g., no medical diagnoses, maintain political neutrality, respect cultural sensitivity, avoid financial advice, cite sources when needed",
      key: 'constraints'
    },
    {
      id: 6,
      title: "Style & Format",
      question: "What tone, format, and communication style should be used?",
      description: "Specify how information should be presented and structured.",
      checklist: [
        "What tone is appropriate (formal, casual, empathetic)?",
        "What format works best (paragraphs, bullets, steps)?",
        "What reading level should be used?",
        "How long should responses typically be?",
        "What special formatting or structure is needed?"
      ],
      dropdown: [
        "Formal and professional",
        "Conversational and friendly",
        "Empathetic and supportive",
        "Direct and concise",
        "Academic and scholarly",
        "Simple and clear",
        "Technical and precise",
        "Creative and engaging",
        "Authoritative and confident",
        "Patient and instructional",
        "Bullet points and lists",
        "Step-by-step instructions",
        "Q&A format",
        "Narrative storytelling",
        "Case study examples",
        "Plain language (8th grade level)",
        "Professional language (college level)",
        "Technical language (expert level)",
        "Multilingual support needed",
        "Visual aids recommended"
      ],
      placeholder: "Select from dropdown or describe your preferred style",
      key: 'style'
    }
  ];

  const handleInputChange = (key, value) => {
    setResponses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const optimizePrompt = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: responses.finalPrompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to optimize prompt');
      }

      const data = await response.json();
      
      setResponses(prev => ({
        ...prev,
        optimizedPrompt: data.optimizedPrompt
      }));
      setShowOptimized(true);
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      alert('Sorry, there was an error optimizing your prompt. Please try again.');
    }
    setIsOptimizing(false);
  };

  const generateFinalPrompt = () => {
    const prompt = `You are a ${responses.role}. Your goal is to ${responses.goal}.

Context: ${responses.context}. Target audience: ${responses.audience}.

Constraints: ${responses.constraints}

Style: ${responses.style}

Safety & Boundaries:
- State your limitations when relevant
- Redirect to human experts when appropriate  
- Avoid unsafe, biased, or unethical content
- Maintain neutrality and respect cultural sensitivity`;

    setResponses(prev => ({
      ...prev,
      finalPrompt: prompt
    }));
    setCurrentStep(7);
  };

  const copyToClipboard = async (text = null) => {
    try {
      const textToCopy = text || (showOptimized ? responses.optimizedPrompt : responses.finalPrompt);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setResponses({
      role: '',
      goal: '',
      context: '',
      audience: '',
      constraints: '',
      style: '',
      finalPrompt: '',
      optimizedPrompt: ''
    });
    setCopied(false);
    setShowOptimized(false);
  };

  const currentStepData = steps[currentStep - 1];
  const canProceed = currentStepData ? responses[currentStepData.key].trim() !== '' : false;
  const allStepsComplete = steps.every(step => responses[step.key].trim() !== '');

  if (currentStep === 7) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Custom AI Prompt</h1>
          <p className="text-gray-600">Ready to use with any AI assistant!</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {showOptimized ? 'AI-Optimized Prompt' : 'Generated Prompt'}
              </h2>
              {showOptimized && (
                <p className="text-sm text-green-600 mt-1">✨ Enhanced for clarity and effectiveness</p>
              )}
            </div>
            <div className="flex gap-2">
              {!showOptimized && (
                <button
                  onClick={optimizePrompt}
                  disabled={isOptimizing}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isOptimizing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      ✨ Optimize with AI
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => copyToClipboard()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-4 rounded border overflow-x-auto">
            {showOptimized ? responses.optimizedPrompt : responses.finalPrompt}
          </pre>
        </div>

        {showOptimized && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-blue-800">Compare Versions</h3>
              <button
                onClick={() => setShowOptimized(false)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Show Original
              </button>
            </div>
            <div className="text-sm text-blue-700">
              <p>The AI has enhanced your prompt for better clarity, structure, and effectiveness while maintaining your original requirements.</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Create Another Prompt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Custom Prompt Generation Assistant</h1>
        <p className="text-gray-600">Create structured prompts step-by-step for optimal AI performance</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of 6</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / 6) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id === currentStep
                  ? 'bg-blue-600 text-white'
                  : step.id < currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </div>
          ))}
        </div>
      </div>

      {/* Current step */}
      <div className="bg-white border rounded-lg shadow-sm p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Step {currentStep}: {currentStepData.title}
          </h2>
          <p className="text-gray-600 text-lg mb-3">{currentStepData.question}</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{currentStepData.description}</p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-3">Consider these questions:</h4>
            <ul className="space-y-2">
              {currentStepData.checklist.map((item, index) => (
                <li key={index} className="flex items-start text-blue-700 text-sm">
                  <span className="text-blue-400 mr-2 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          {currentStepData.dropdown ? (
            <div className="space-y-4">
              <select
                value={responses[currentStepData.key]}
                onChange={(e) => handleInputChange(currentStepData.key, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select an option or type below --</option>
                {currentStepData.dropdown.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              <div className="text-center text-gray-500 text-sm">OR</div>
              <textarea
                value={responses[currentStepData.key]}
                onChange={(e) => handleInputChange(currentStepData.key, e.target.value)}
                placeholder={currentStepData.placeholder}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>
          ) : (
            <textarea
              value={responses[currentStepData.key]}
              onChange={(e) => handleInputChange(currentStepData.key, e.target.value)}
              placeholder={currentStepData.placeholder}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
            />
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {currentStep === 6 ? (
            <button
              onClick={generateFinalPrompt}
              disabled={!allStepsComplete}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                allStepsComplete
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Generate Prompt
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                canProceed
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary of completed steps */}
      {currentStep > 1 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary So Far</h3>
          <div className="space-y-3">
            {steps.slice(0, currentStep - 1).map((step) => (
              responses[step.key] && (
                <div key={step.id} className="flex">
                  <span className="font-medium text-gray-700 w-24 flex-shrink-0">{step.title}:</span>
                  <span className="text-gray-600">{responses[step.key]}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;
