import React, { useEffect, useState } from 'react';

function Recommendations() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function fetchLatest() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/reports', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!data.reports || data.reports.length === 0) {
          setError('No reports found.');
          setLoading(false);
          return;
        }
        // Sort by createdAt descending
        const sorted = [...data.reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Try to extract recommendations from insights or summary
        const latest = sorted[0];
        let recs = [];
        if (latest.insights && latest.insights.length > 0) {
          recs = latest.insights.filter(line => /recommend/i.test(line));
        }
        // If not found in insights, try summary
        if (recs.length === 0 && latest.summary) {
          const matches = latest.summary.match(/recommendations?:([\s\S]*)/i);
          if (matches && matches[1]) {
            recs = matches[1].split('\n').map(s => s.trim()).filter(Boolean);
          }
        }
        setRecommendations(recs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recommendations.');
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  if (loading) return <section><h3>Actionable Recommendations</h3><div>Loading...</div></section>;
  if (error) return <section><h3>Actionable Recommendations</h3><div style={{color:'red'}}>{error}</div></section>;

  return (
    <section>
      <h3>Actionable Recommendations</h3>
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      ) : (
        <div style={{color:'#666'}}>No recommendations found in your latest report.</div>
      )}
    </section>
  );
}

export default Recommendations;
