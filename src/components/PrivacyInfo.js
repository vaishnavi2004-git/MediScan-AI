import React from 'react';

function PrivacyInfo() {
  return (
    <section style={{maxWidth:700,margin:'2em auto',padding:'2em',background:'#f8fbfd',borderRadius:'1em'}}>
      <h2>Privacy & Data Security</h2>
      <p>
        Your privacy and the security of your medical data are our top priorities. Here’s how we keep your information safe:
      </p>
      <ul style={{marginBottom:'1.5em'}}>
        <li><b>End-to-End Encryption:</b> All sensitive medical report data is encrypted using AES-256 before being stored on our servers. This means even if storage is compromised, your data remains unreadable without your credentials.</li>
        <li><b>Secure Communication:</b> All data sent between your browser and our servers is encrypted using HTTPS, protecting your information from eavesdropping.</li>
        <li><b>Audit Logging:</b> Every access, creation, or deletion of your reports and account is securely logged. This ensures transparency and helps detect unauthorized access attempts.</li>
        <li><b>User Controls:</b> You have full control over your data. You can delete individual reports or your entire account and all associated data at any time using the controls below.</li>
        <li><b>Authentication:</b> Only you can access your data, protected by secure password-based authentication and JWT tokens. We never share your data with third parties.</li>
        <li><b>Security Best Practices:</b> We use rate limiting, input validation, and regular security audits to protect against unauthorized access and vulnerabilities.</li>
      </ul>
      <h3>Delete Your Data</h3>
      <DeleteAccountSection />
      <div style={{marginTop:'2em'}}>
        <b>Questions or Concerns?</b> Contact us at <a href="mailto:support@aihealth.com">support@aihealth.com</a>.
      </div>
      <div style={{marginTop:'1em', color:'#666'}}>
        <small>We take your privacy seriously. <a href="#" style={{color:'#2176ae'}}>Read our privacy policy</a>.</small>
      </div>
    </section>
  );
}

function DeleteAccountSection() {
  // Show delete buttons for account and all reports
  const [status, setStatus] = React.useState('');
  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all reports.')) return;
    const token = localStorage.getItem('token');
    if (!token) { setStatus('You must be logged in.'); return; }
    setStatus('Deleting...');
    try {
      const res = await fetch('http://localhost:5000/user', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        localStorage.removeItem('token');
        setStatus('Account and all data deleted. You will be logged out.');
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        const data = await res.json();
        setStatus('Error: ' + (data.error || 'Failed to delete.'));
      }
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
  };
  return (
    <div style={{marginTop:'1em'}}>
      <button onClick={handleDelete} style={{background:'#e74c3c',color:'#fff',padding:'0.7em 1.5em',border:'none',borderRadius:'0.5em',fontWeight:600,cursor:'pointer'}}>Delete My Account & All Data</button>
      <div style={{marginTop:'0.7em',color:'#e74c3c'}}>{status}</div>
    </div>
  );
}

export default PrivacyInfo;
