import React from 'react';
import Recommendations from '../components/Recommendations';

export default function RecommendationsPage() {
  return (
    <section style={{maxWidth:900,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>Recommendations</h2>
      <Recommendations />
    </section>
  );
}
