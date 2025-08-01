import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ReportContext } from '../ReportContext';

function ActionableInsights() {
  const { report } = React.useContext(ReportContext);
  const navigate = useNavigate();

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Actionable Insights</h1>
        <Link to="/summary" className="back-link">← Back to Summary</Link>
      </div>

      <div className="insights-content">
        {report.insightsSection && report.insightsSection.length > 0 ? (
          <div>
            {report.insightsSection.map((insight, index) => (
              <div key={index} className="insight-item">
                <h3>Insight {index + 1}</h3>
                <p>{insight}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No actionable insights available for this report.</p>
        )}
      </div>

      <div className="action-buttons">
        <Link to="/summary" className="back-btn">
          <span className="btn-icon">←</span>
          Back to Summary
        </Link>
      </div>
    </div>
  );
}

export default ActionableInsights;
