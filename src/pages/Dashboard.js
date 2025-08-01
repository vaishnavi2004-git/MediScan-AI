import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeatureCard from './FeatureCard';
import TrustSection from '../components/TrustSection';
import '../components/TrustSection.css';
import './FeatureCard.css';
import './Dashboard.css';
import './ai-chatbot.css';

function Dashboard() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const containerRef = useRef(null);

  const scrollToCard = (index) => {
    if (!containerRef.current) return;
    const cardWidth = 300 + 20; // card width + gap
    containerRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setCurrentCardIndex(index);
  };

  // Handle scrolling when clicking dots
  const handleDotClick = (index) => {
    scrollToCard(index);
  };

  // Update current card index when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const cardWidth = 300 + 20;
      const scrollPosition = containerRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setCurrentCardIndex(newIndex);
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="dashboard">
      <Header />
      <main>
        <HeroSection />
        <div className="ai-chatbot-container">
          <div className="layout-container">
            <div className="layout-content-container">
              <div className="ai-chatbot-content">
                <div className="hero-image" style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcTpW7R9V9ydUyhsqymeeQ4uesAAimwRY3H9tvPHptYRT3jhihy_6hkZkCA8NBUEnfebWqY0p6HL13dAbAOHxdOOCOjfljydczRFSScC80AeFCqhg8yX2rf1F8ZaULaMGpj5HnOM8eE9u0tu6CGfY0xQqnlnq4o14Hv0_XcA4a4nbZvQMCIJkr2iBJxo0yEeDgx8fzlz-5BdTEJzT_N3HFkDyGlHN3F5p2atvb48VAFbLvJQBEIRG-CQIPLXolfN9QYZmj_mWAnSsE")'
                }}>
                </div>
                
                <div className="feature-section">
                  <h2 className="ai-chatbot-title">AI Report Analysis</h2>
                  <p className="ai-chatbot-subtitle">
                    Our AI Report Analysis provides clear, concise explanations of your medical reports, making complex information easy to understand. Interact with the chatbot to ask questions
                    and gain deeper insights into your health.
                  </p>
                </div>

                <div className="button-section">
                  <Link to="/chatbot" className="ai-chatbot-button">
                    <span className="truncate">Start Chatting</span>
                  </Link>
                </div>

                <div className="analysis-section">
                  <h2 className="analysis-title">AI-Powered Medical Report Analysis</h2>
                  <p className="analysis-subtitle">
                    Our AI analyzes your medical reports to provide you with a comprehensive understanding of your health. Here's how:
                  </p>
                </div>

                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="feature-card-title">Identifies Critical Information</h2>
                      <p className="feature-card-description">Quickly pinpoints key data and anomalies in your reports.</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon" data-icon="TextB" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M170.48,115.7A44,44,0,0,0,140,40H72a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM80,56h60a28,28,0,0,1,0,56H80Zm72,136H80V128h72a32,32,0,0,1,0,64Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="feature-card-title">Summarizes Findings</h2>
                      <p className="feature-card-description">Provides concise summaries of complex medical findings.</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon" data-icon="ClockCounterClockwise" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="feature-card-title">Compares Results Over Time</h2>
                      <p className="feature-card-description">Tracks changes in your health metrics across different reports.</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon" data-icon="Warning" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="feature-card-title">Highlights Potential Health Risks</h2>
                      <p className="feature-card-description">Alerts you to potential health concerns based on your report data.</p>
                    </div>
                  </div>
                </div>
                <div className="button-section">
                  <Link to="/analyse" className="ai-chatbot-button">
                    <span className="truncate">Analyse Your Report</span>
                  </Link>
                </div>

                {/* Services Section */}
                <div className="services-section" id="services">
                  <h2 className="section-title">Our Services</h2>
                  <div className="services-container" ref={containerRef}>
                    <div className="service-card">
                      <img src="https://via.placeholder.com/300x200" alt="Analyse Report" />
                      <h3 className="service-card-title">Analyse Report</h3>
                      <p className="service-card-description">
                        Get comprehensive analysis of your medical reports with AI-powered insights.
                      </p>
                      <Link to="/analyse" className="service-card-button">Analyse Now</Link>
                    </div>
                    <div className="service-card">
                      <img src="https://via.placeholder.com/300x200" alt="Past Comparisons" />
                      <h3 className="service-card-title">Past Comparisons</h3>
                      <p className="service-card-description">
                        Compare your current health metrics with previous reports to track progress.
                      </p>
                      <Link to="/past-comparison" className="service-card-button">Learn More</Link>
                    </div>
                    <div className="service-card">
                      <img src="https://via.placeholder.com/300x200" alt="Recommendations" />
                      <h3 className="service-card-title">Recommendations</h3>
                      <p className="service-card-description">
                        Receive personalized health recommendations based on your medical data.
                      </p>
                      <Link to="/recommendations" className="service-card-button">Learn More</Link>
                    </div>
                    <div className="service-card">
                      <img src="https://via.placeholder.com/300x200" alt="AI Q&A" />
                      <h3 className="service-card-title">AI Q&A</h3>
                      <p className="service-card-description">
                        Get answers to your health-related questions from our AI expert.
                      </p>
                      <Link to="/chatbot" className="service-card-button">Learn More</Link>
                    </div>
                    <div className="service-card">
                      <img src="https://via.placeholder.com/300x200" alt="Glossary" />
                      <h3 className="service-card-title">Glossary</h3>
                      <p className="service-card-description">
                        Understand complex medical terms with our easy-to-understand glossary.
                      </p>
                      <Link to="/glossary" className="service-card-button">Learn More</Link>
                    </div>
                  </div>
                  <div className="scroll-dots">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className={`scroll-dot ${index === currentCardIndex ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
