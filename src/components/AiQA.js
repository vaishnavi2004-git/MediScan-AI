import React, { useState } from 'react';

function AiQA() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setError(data.error || 'No answer received.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <section>
      <h3>AI-Powered Q&A</h3>
      <form onSubmit={handleSubmit} style={{marginBottom:'1em'}}>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question about your report..."
          style={{width:'60%',padding:'0.5em',marginRight:'0.5em'}}
          disabled={loading}
        />
        <button type="submit" className="cta-btn" disabled={loading || !question.trim()}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {error && <div style={{color:'red',marginBottom:'0.5em'}}>{error}</div>}
      {answer && (
        <div style={{background:'#f4f8fb',borderRadius:'0.7em',padding:'1em',marginTop:'1em'}}>
          <strong>AI Answer:</strong>
          <div style={{marginTop:'0.5em',whiteSpace:'pre-wrap'}}>{answer}</div>
        </div>
      )}
    </section>
  );
}

export default AiQA;
