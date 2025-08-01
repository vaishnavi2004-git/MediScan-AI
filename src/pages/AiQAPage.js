import React from 'react';
import AiQA from '../components/AiQA';

export default function AiQAPage() {
  return (
    <section style={{maxWidth:900,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>AI Q&A</h2>
      <AiQA />
    </section>
  );
}
