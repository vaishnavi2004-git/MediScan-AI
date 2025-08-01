import React, { useEffect, useState } from 'react';

const METRICS = ['Hemoglobin', 'Cholesterol', 'Glucose'];

function parseMetrics(raw) {
  // Simple regex-based extraction (customize as needed)
  const result = {};
  METRICS.forEach(metric => {
    const match = new RegExp(metric + '[^\d]*(\d+\.?\d*)', 'i').exec(raw);
    if (match) result[metric] = parseFloat(match[1]);
  });
  return result;
}

function diffArrow(diff) {
  if (diff > 0) return <span style={{color: 'green'}}>↑</span>;
  if (diff < 0) return <span style={{color: 'red'}}>↓</span>;
  return <span style={{color: 'gray'}}>→</span>;
}

function PastComparison() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latest, setLatest] = useState(null);
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/reports', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!data.reports || data.reports.length < 2) {
          setError('Not enough reports for comparison.');
          setLoading(false);
          return;
        }
        // Sort by createdAt descending
        const sorted = [...data.reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatest(sorted[0]);
        setPrevious(sorted[1]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reports.');
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <section><h3>Comparison with Past Reports</h3><div>Loading...</div></section>;
  if (error) return <section><h3>Comparison with Past Reports</h3><div style={{color:'red'}}>{error}</div></section>;

  const latestMetrics = parseMetrics(latest.raw || '');
  const prevMetrics = parseMetrics(previous.raw || '');

  return (
    <section>
      <h3>Comparison with Past Reports</h3>
      <table style={{width:'100%', borderCollapse:'collapse', marginTop:10}}>
        <thead>
          <tr style={{background:'#f5faff'}}>
            <th style={{padding:'8px', border:'1px solid #eaeaea'}}>Metric</th>
            <th style={{padding:'8px', border:'1px solid #eaeaea'}}>Previous</th>
            <th style={{padding:'8px', border:'1px solid #eaeaea'}}>Latest</th>
            <th style={{padding:'8px', border:'1px solid #eaeaea'}}>Change</th>
          </tr>
        </thead>
        <tbody>
          {METRICS.map(metric => {
            const prev = prevMetrics[metric];
            const curr = latestMetrics[metric];
            if (prev === undefined && curr === undefined) return null;
            const diff = curr !== undefined && prev !== undefined ? curr - prev : null;
            return (
              <tr key={metric}>
                <td style={{padding:'8px', border:'1px solid #eaeaea'}}>{metric}</td>
                <td style={{padding:'8px', border:'1px solid #eaeaea'}}>{prev !== undefined ? prev : '-'}</td>
                <td style={{padding:'8px', border:'1px solid #eaeaea'}}>{curr !== undefined ? curr : '-'}</td>
                <td style={{padding:'8px', border:'1px solid #eaeaea'}}>{diff !== null ? diffArrow(diff) : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{marginTop:'1em', color:'#666'}}>
        <small>Green ↑ = increase, Red ↓ = decrease, Gray → = no change.</small>
      </div>
    </section>
  );
}

export default PastComparison;
