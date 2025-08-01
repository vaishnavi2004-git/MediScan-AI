import React from 'react';
import PrivacyInfo from '../components/PrivacyInfo';

export default function PrivacyInfoPage() {
  return (
    <section style={{maxWidth:900,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>Privacy & Data Security</h2>
      <PrivacyInfo />
    </section>
  );
}
