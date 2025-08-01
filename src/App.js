import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import SummaryPage from './pages/Summary';
import PastComparisonPage from './pages/PastComparisonPage';
import RecommendationsPage from './pages/RecommendationsPage';
import GlossaryPage from './pages/GlossaryPage';
import PrivacyInfoPage from './pages/PrivacyInfoPage';
import AiQAPage from './pages/AiQAPage';
import Contact from './pages/Contact';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import { ReportProvider } from './ReportContext';
import Header from './components/Header';
import Services from './pages/Services';
import Chatbot from './pages/Chatbot';
import AnalysePage from './pages/AnalysePage';
import Footer from './components/Footer';
import RiskAssessment from './pages/RiskAssessment';
import TrendAnalysis from './pages/TrendAnalysis';
import ActionableInsights from './pages/ActionableInsights';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  return (
    <Router>
      <ReportProvider>
        <div className="app-container">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={
              <>
                <Header />
                <Dashboard />
              </>
            } />
            <Route path="/dashboard" element={
              <>
                <Header />
                <Dashboard />
              </>
            } />
            <Route path="/services" element={
              <>
                <Header />
                <Services />
              </>
            } />
            <Route path="/chatbot" element={
              <>
                <Header />
                <Chatbot />
              </>
            } />
            <Route path="/analyse" element={
              <>
                <Header />
                <AnalysePage />
              </>
            } />
            <Route path="/past-comparison" element={
              <>
                <Header />
                <AnalysePage />
              </>
            } />
            <Route path="/recommendations" element={
              <>
                <Header />
                <AnalysePage />
              </>
            } />
            <Route path="/glossary" element={
              <>
                <Header />
                <GlossaryPage />
              </>
            } />
            <Route path="/risk-assessment" element={
              <>
                <Header />
                <RiskAssessment />
              </>
            } />
            <Route path="/trend-analysis" element={
              <>
                <Header />
                <TrendAnalysis />
              </>
            } />
            <Route path="/actionable-insights" element={
              <>
                <Header />
                <ActionableInsights />
              </>
            } />
            <Route path="/recommendations" element={
              <>
                <Header />
                <RecommendationsPage />
              </>
            } />
            <Route path="/summary" element={
              <>
                <Header />
                <SummaryPage />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <Contact />
              </>
            } />
            <Route path="/about" element={
              <>
                <Header />
                <About />
              </>
            } />
            <Route path="/privacy" element={
              <>
                <Header />
                <PrivacyInfoPage />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Header />
                <Profile />
              </>
            } />
          </Routes>
        </div>
      </ReportProvider>
    </Router>
  );
}

export default App;
