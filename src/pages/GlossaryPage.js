import React from 'react';
import Glossary from '../components/Glossary';

export default function GlossaryPage() {
  return (
    <section style={{maxWidth:900,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>Glossary</h2>
      <Glossary />
    </section>
  );
}
