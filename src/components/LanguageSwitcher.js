import React, { useState } from 'react';

const translations = {
  en: {
    greeting: 'Welcome to your Health Dashboard!'
  },
  hi: {
    greeting: 'आपके स्वास्थ्य डैशबोर्ड में आपका स्वागत है!'
  }
};

function LanguageSwitcher() {
  const [lang, setLang] = useState('en');
  return (
    <section>
      <h3>Multilingual Support</h3>
      <label>
        Language: {' '}
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </label>
      <div style={{marginTop: '1em', fontWeight: 500}}>{translations[lang].greeting}</div>
      <div style={{color:'#666', marginTop:'0.5em'}}>
        <small>More languages coming soon.</small>
      </div>
    </section>
  );
}

export default LanguageSwitcher;
