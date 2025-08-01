import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ReportContext } from '../ReportContext';

function RiskAssessment() {
  const { report } = React.useContext(ReportContext);
  const navigate = useNavigate();

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Risk Assessment</h1>
        <Link to="/summary" className="back-link">← Back to Summary</Link>
      </div>

      <div className="risk-content">
        {report.riskAssessment ? (
          <div dangerouslySetInnerHTML={{ __html: report.riskAssessment.replace(/\n/g, '<br>') }} />
        ) : (
          <p>No risk assessment data available for this report.</p>
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

export default RiskAssessment;
