import React from 'react';
import FeatureCard from './FeatureCard';
import './FeatureCard.css';
import summaryImg from '../assets/feature-summary.png';
import comparisonImg from '../assets/feature-comparison.png';
import recommendationsImg from '../assets/feature-recommendations.png';
import glossaryImg from '../assets/feature-glossary.png';
import privacyImg from '../assets/feature-privacy.png';
import aiqaImg from '../assets/feature-aiqa.png';

const features = [
  {
    title: 'Medical Report Analysis',
    image: summaryImg,
    description: 'Get instant AI-powered analysis of your medical reports with detailed summaries and insights.',
    to: '/upload'
  },
  {
    title: 'Past Report Comparison',
    image: comparisonImg,
    description: 'Compare your current report with past reports to track health trends and changes over time.',
    to: '/past-comparison'
  },
  {
    title: 'Personalized Recommendations',
    image: recommendationsImg,
    description: 'Receive customized health recommendations based on your medical report analysis.',
    to: '/recommendations'
  },
  {
    title: 'Medical Glossary',
    image: glossaryImg,
    description: 'Access our comprehensive medical glossary to understand medical terms and conditions.',
    to: '/glossary'
  },
  {
    title: 'AI Q&A',
    image: aiqaImg,
    description: 'Ask health-related questions and get accurate answers from our AI-powered chatbot.',
    to: '/ai-qa'
  },
  {
    title: 'Data Privacy',
    image: privacyImg,
    description: 'Learn how we protect your medical data and maintain your privacy.',
    to: '/privacy'
  }
];

function Services() {
  return (
    <div className="services-container">
      <h1>Our Services</h1>
      <div className="features-grid">
        {features.map(f => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>
  );
}

export default Services;
