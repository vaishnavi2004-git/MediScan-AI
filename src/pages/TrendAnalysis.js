import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ReportContext } from '../ReportContext';

function TrendAnalysis() {
  const { report } = React.useContext(ReportContext);
  const navigate = useNavigate();

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Trend Analysis</h1>
        <Link to="/summary" className="back-link">← Back to Summary</Link>
      </div>

      <div className="trend-content">
        {report.trends ? (
          <div dangerouslySetInnerHTML={{ __html: report.trends.replace(/\n/g, '<br>') }} />
        ) : (
          <p>No trend analysis data available for this report.</p>
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

export default TrendAnalysis;
