import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: Make sure to set your Gemini API key in your environment variables:
// REACT_APP_GEMINI_API_KEY=your_api_key_here

// Debugging: Log the environment variables
console.log('Environment variables:', process.env);

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Debugging: Log the API key directly
console.log('Gemini API Key:', GEMINI_API_KEY);

// Initialize the AI client
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

// Export our custom AI generation function
export const generateAIResponse = async (prompt) => {
  try {
    console.log('Generating response for prompt:', prompt);
    console.log('Using API key:', GEMINI_API_KEY?.substring(0, 10) + '...'); // Log first 10 chars of key for debugging
    
    // Add safety checks
    if (!GEMINI_API_KEY) {
      throw new Error('No API key found. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
    }

    // Use the latest Gemini model
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    if (!model) {
      throw new Error('Failed to get model instance. Please check if your API key is valid.');
    }

    console.log('Model obtained successfully');
    
    // Add safety checks
    if (!model) {
      throw new Error('Failed to get model instance. Please check if your API key is valid.');
    }

    // Debugging: Log model details
    console.log('Model details:', model);

    const result = await model.generateContent(prompt);
    console.log('Content generation completed');
    
    if (!result) {
      throw new Error('No response received from AI. Please try again.');
    }

    const response = await result.response;
    console.log('Response received');
    
    if (!response) {
      throw new Error('Empty response received. Please try again.');
    }

    return response.text();
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Debugging: Log the full error object
    console.error('Full error object:', error);
    
    // Provide more specific error messages
    if (error.message.includes('Invalid API key')) {
      throw new Error('Invalid API key. Please check your .env file and make sure the API key is correct.');
    } else if (error.message.includes('Quota exceeded')) {
      throw new Error('API quota exceeded. Please wait a few minutes and try again.');
    } else if (error.message.includes('Not authorized')) {
      throw new Error('Unauthorized access. Please check if your API key has the necessary permissions.');
    } else if (error.message.includes('model not found')) {
      throw new Error('Model not found. Please check if your API key has access to the Gemini model. Make sure you have enabled the Generative AI API in your Google Cloud Console.');
    } else {
      throw new Error('Failed to generate AI response. Please try again. If the problem persists, check your API key and try restarting the application.');
    }
  }
};
