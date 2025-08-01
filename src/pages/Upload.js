import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import medicalImg from '../assets/placeholder-medical.png';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { ReportContext } from '../ReportContext';

function Upload() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [error, setError] = useState('');
  const fileInput = useRef();

  // Helper: Run OCR on an image file or dataURL
  const runOcr = async (image) => {
    setLoading(true);
    setOcrResult('');
    setError('');
    try {
      const { data: { text } } = await Tesseract.recognize(image, 'eng');
      setOcrResult(text);
      setLoading(false);
      // Optionally, navigate to summary or process further
      // navigate('/summary');
    } catch (err) {
      setOcrResult('');
      setError('OCR failed: ' + err.message);
      setLoading(false);
    }
  };

  // --- AI Analysis Simulation ---
  const [analysis, setAnalysis] = useState('');
  const [editText, setEditText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEdit = (e) => setEditText(e.target.value);

  const { setReport } = useContext(ReportContext);
  const handleSubmitForAnalysis = async () => {
    setSubmitted(true);
    setAnalysis('');
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText || ocrResult })
      });
      const data = await response.json();
      if (data.result) {
        setAnalysis(data.result);
        // Extract insights and glossary terms (basic parsing, can be improved)
        const summary = data.result;
        // Insights: lines containing "risk", "recommend", or "abnormal"
        const insights = data.result.split('\n').filter(l => /risk|recommend|abnormal|suggest|consider|consult/i.test(l));
        // Glossary: extract capitalized medical terms (very basic, can be improved)
        const glossary = Array.from(new Set((data.result.match(/\b([A-Z]{2,}[a-z]*)\b/g) || []).filter(term => term.length > 2)));
        setReport({ summary, insights, glossary, raw: data.result });
        // Save report if logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await fetch('http://localhost:5000/reports', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify({ summary, insights, glossary, raw: data.result })
            });
          } catch (err) {
            // Optionally handle/report error, but don't block navigation
          }
        }
        // Redirect to summary
        navigate('/summary');
      } else {
        setAnalysis('AI analysis failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setAnalysis('AI analysis failed: ' + err.message);
    }
  };



  // Helper: Extract images from PDF and run OCR on each page
  const processPdf = async (pdfFile) => {
    setLoading(true);
    setOcrResult('');
    setError('');
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');
          // Run OCR on this page
          const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng');
          fullText += `\n--- Page ${i} ---\n${text}`;
        }
        setOcrResult(fullText);
        setLoading(false);
      } catch (err) {
        setOcrResult('');
        setError('PDF scan failed: ' + err.message);
        setLoading(false);
      }
    };
    fileReader.readAsArrayBuffer(pdfFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOcrResult('');
    setError('');
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        processPdf(selectedFile);
      } else if (selectedFile.type.startsWith('image/')) {
        runOcr(selectedFile);
      } else {
        setOcrResult('');
        setError('Unsupported file type');
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === 'dragover');
  };

  return (
    <>
      <div className="card" style={{ textAlign: 'center', marginBottom: '2em' }}>
        <img src={medicalImg} alt="Medical report analysis" style={{ maxWidth: '180px', marginBottom: '1.5rem' }} />
        <h2>Transform Your Medical Reports into Instant Insights with AI</h2>
        <p style={{ maxWidth: 600, margin: '1rem auto', color: 'var(--muted)' }}>
          Upload your medical reports and let our advanced AI analyze, summarize, and provide actionable health recommendations. Powered by state-of-the-art OCR and NLP technology, your data is secure and your insights are instant.
        </p>
        <button className="cta-btn" onClick={() => navigate('/upload')}>Upload Report</button>
        <button className="cta-btn" onClick={() => navigate('/summary')}>Try Demo</button>
      </div>
      <div className="upload-page">
        <h2>Upload Your Medical Report</h2>
        <div
          className={`upload-area${dragActive ? ' drag-active' : ''}`}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          aria-label="Upload medical report"
        >
          <p>Drag & drop PDF, JPG, or PNG here, or <button type="button" className="cta-btn" style={{margin:'0.5em 0'}} onClick={() => fileInput.current.click()}>Browse Files</button></p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            ref={fileInput}
            onChange={handleFileChange}
          />
          <textarea
            className="ocr-edit-textarea"
            value={editText || ocrResult}
            onChange={handleEdit}
            rows={10}
            style={{ width: '100%', borderRadius: '1rem', border: '1px solid var(--primary)', padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem' }}
            aria-label="Edit extracted report text"
          />
          <form onSubmit={e => { e.preventDefault(); handleSubmitForAnalysis(); }}>
            <button className="cta-btn" type="submit" style={{ marginTop: 0 }}>Submit & Analyze</button>
          </form>
        </div>
      )}
      {submitted && (
        <div className="card" style={{ marginTop: '2rem', background: '#f8fbfd' }}>
          <h3>AI Health Insights</h3>
          {analysis ? (
            <div style={{ color: 'var(--text)', fontSize: '1.15rem' }}>{analysis}</div>
          ) : (
            <div className="loading-spinner" aria-label="Analyzing" />
          )}
        </div>
      )}
      {error && <div className="file-info" style={{ color: 'var(--danger)' }}>{error}</div>}
    </div>
    </>
  );
}

export default Upload;
