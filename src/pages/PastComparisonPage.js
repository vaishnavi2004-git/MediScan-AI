import React from 'react';
import PastComparison from '../components/PastComparison';

export default function PastComparisonPage() {
  return (
    <section style={{maxWidth:900,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>Past Comparison</h2>
      <PastComparison />
    </section>
  );
}
