import React from 'react';
import './TrustSection.css';

const benefits = [
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Your medical data is encrypted and protected with military-grade security. We never share your information without your explicit consent.'
  },
  {
    icon: '✅',
    title: 'AI Accuracy',
    description: 'Our AI system is trained on extensive medical data and continuously updated to provide accurate and reliable health insights.'
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    description: 'Get your health analysis within minutes. Our system processes your medical data quickly and efficiently.'
  },
  {
    icon: '📊',
    title: 'Detailed Reports',
    description: 'Receive comprehensive reports with actionable insights. Our reports are easy to understand and include personalized recommendations.'
  },
  {
    icon: '👥',
    title: 'AI Chatbot',
    description: 'Access to medical professionals AI chatbot who can review your reports and provide expert guidance when needed.'
  },
  {
    icon: '📱',
    title: 'Mobile Access',
    description: 'Access your health data and reports from anywhere. Our platform is fully responsive and works on all devices.'
  }
];

function TrustSection() {
  return (
    <section className="trust-section">
      <div className="container">
        <h2 className="section-title">Why Trust AI Health Analyzer?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
