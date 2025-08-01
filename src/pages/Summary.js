import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ReportContext } from '../ReportContext';
import VisualSummaries from '../components/VisualSummaries';

function Summary() {
  const { report } = React.useContext(ReportContext);
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const sections = [
    { title: 'Risk Assessment', path: '/risk-assessment' },
    { title: 'Trend Analysis', path: '/trend-analysis' },
    { title: 'Actionable Insights', path: '/actionable-insights' },
    { title: 'Personalized Recommendations', path: '/recommendations' },
    { title: 'Glossary', path: '/glossary' }
  ];

  return (
    <div className="summary-container">
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <div className="summary-header">
        <h1>Medical Report Analysis</h1>
        <p className="summary-subtitle">Comprehensive analysis of your medical report</p>
      </div>

      <div className="summary-content">
        <section className="main-summary">
          <h2>Report Summary</h2>
          <div className="summary-text">
            {report.summary ? (
              <div dangerouslySetInnerHTML={{ __html: report.summary.replace(/\n/g, '<br>') }} />
            ) : (
              <p>No summary available. Please analyze a report.</p>
            )}
          </div>
        </section>

        <section className="visual-summary">
          <h2>Visual Summary</h2>
          {report.visualSummary ? (
            <VisualSummaries report={report} />
          ) : (
            <p>No visual summary available for this report.</p>
          )}
        </section>

        <section className="additional-sections">
          <h2>Additional Analysis Sections</h2>
          <div className="section-links">
            {sections.map((section, index) => (
              <Link
                key={index}
                to={section.path}
                className="section-link"
                onClick={(e) => {
                  const sectionData = report[section.path.replace('/', '')];
                  if (!sectionData) {
                    e.preventDefault();
                    setError(`No ${section.title.toLowerCase()} data available`);
                  }
                }}
              >
                <span className="section-icon">→</span>
                <span className="section-title">{section.title}</span>
                <span className="section-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="action-buttons">
          <button 
            className="download-btn" 
            onClick={() => window.print()}
            title="Download/Print Report"
          >
            <span className="btn-icon">⬇️</span>
            Download Report
          </button>
          <Link to="/analyse" className="back-btn">
            <span className="btn-icon">←</span>
            Analyze Another Report
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Summary;
