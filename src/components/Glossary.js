import React, { useEffect, useState } from 'react';

function Glossary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [glossary, setGlossary] = useState([]);

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
        const latest = sorted[0];
        setGlossary(latest.glossary || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch glossary.');
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  if (loading) return <section><h3>Medical Term Glossary</h3><div>Loading...</div></section>;
  if (error) return <section><h3>Medical Term Glossary</h3><div style={{color:'red'}}>{error}</div></section>;

  return (
    <section>
      <h3>Medical Term Glossary</h3>
      {glossary.length > 0 ? (
        <ul>
          {glossary.map((term, i) => (
            <li key={i}>{term}</li>
          ))}
        </ul>
      ) : (
        <div style={{color:'#666'}}>No glossary terms found in your latest report.</div>
      )}
    </section>
  );
}

export default Glossary;
