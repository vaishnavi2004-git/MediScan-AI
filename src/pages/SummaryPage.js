import React from 'react';
import VisualSummaries from '../components/VisualSummaries';
import { ReportContext } from '../ReportContext';
import { useContext } from 'react';

export default function SummaryPage() {
  const { report } = useContext(ReportContext);
  return (
    <section style={{maxWidth:900,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>Report Summary</h2>
      <div style={{
        whiteSpace: 'pre-wrap',
        fontSize: '1.1rem',
        color: 'var(--text)',
        fontWeight: 'bold',
        marginTop: '1em'
      }}>
        {report.summary?.replace(/\*/g, '') || 'No summary available. Please analyze a report.'}
      </div>
      <VisualSummaries report={report} />
    </section>
  );
}
