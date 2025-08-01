import React from 'react';

export default function Contact() {
  return (
    <section style={{maxWidth:600,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>Contact Us</h2>
      <p>For support, feedback, or partnership inquiries, please email us at <a href="mailto:support@aihealth.com">support@aihealth.com</a>.</p>
      <form style={{marginTop:'2em'}}>
        <label>Name:<br/><input type="text" name="name" style={{width:'100%',marginBottom:'1em'}} /></label><br/>
        <label>Email:<br/><input type="email" name="email" style={{width:'100%',marginBottom:'1em'}} /></label><br/>
        <label>Message:<br/><textarea name="message" rows={5} style={{width:'100%',marginBottom:'1em'}} /></label><br/>
        <button type="submit" className="cta-btn">Send Message</button>
      </form>
    </section>
  );
}
