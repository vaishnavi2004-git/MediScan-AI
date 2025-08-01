import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeatureCard({ title, image, description, to }) {
  const navigate = useNavigate();
  return (
    <div className="feature-card" style={{background:'#f8fbfd',borderRadius:'1em',padding:'1.5em',margin:'1em',boxShadow:'0 2px 8px rgba(33,118,174,0.04)',maxWidth:320,display:'flex',flexDirection:'column',alignItems:'center'}}>
      <img src={image} alt={title+" icon"} style={{width:80,height:80,objectFit:'contain',marginBottom:'1em'}} />
      <h4 style={{margin:'0.5em 0'}}>{title}</h4>
      <p style={{fontSize:'1em',color:'#444',marginBottom:'1em'}}>{description}</p>
      <button className="cta-btn" onClick={()=>navigate(to)}>Go to {title}</button>
    </div>
  );
}
