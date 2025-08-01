import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ReportContext } from '../ReportContext';
import '../components/ServicePage.css';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { format } from 'date-fns';

const medicalImg = '/images/medical-placeholder.png';

// Helper function to parse and render analysis sections
const parseAnalysisSections = (analysis) => {
  if (!analysis) return [];
  
  // Split by section headers (lines that start with # followed by text and end with #)
  const sectionRegex = /##?\s*(.+?)\s*##?\s*([^#]*)/g;
  const sections = [];
  let match;
  
  while ((match = sectionRegex.exec(analysis)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    if (title && content) {
      sections.push({ title, content });
    }
  }
  
  return sections.length > 0 ? sections : [{ title: 'Analysis', content: analysis }];
};

// Function to format text with markdown-like syntax (e.g., **bold**)
const formatText = (text) => {
  if (!text) return '';
  
  // Replace **text** with <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace newlines with <br> for proper HTML line breaks
  return formattedText.split('\n').join('<br>');
};

// Component to render analysis sections
const AnalysisSection = ({ title, content }) => {
  // Check for bullet points or numbered lists
  const hasList = content.includes('•') || content.includes('*') || /\d+\./.test(content);
  
  // Format the content with markdown-like syntax
  const formattedContent = formatText(content);
  
  return (
    <div className="analysis-section">
      <h4 className="section-title">
        {title.includes('Summary') && <i className="fas fa-file-alt"></i>}
        {title.includes('Risk') && <i className="fas fa-exclamation-triangle"></i>}
        {title.includes('Recommendation') && <i className="fas fa-lightbulb"></i>}
        {title.includes('Insight') && <i className="fas fa-chart-line"></i>}
        {title}
      </h4>
      <div 
        className={`section-content ${hasList ? 'has-list' : ''}`}
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  );
};

const AnalysePage = () => {
  const navigate = useNavigate();
  const { addReport, reports } = useContext(ReportContext);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [editText, setEditText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInput = useRef(null);
  
  useEffect(() => {
    console.log('Current reports in context:', reports);
  }, [reports]);

  // Helper: Run OCR on an image file or dataURL
  const runOcr = async (image) => {
    setIsLoading(true);
    setOcrResult('');
    setError('');
    try {
      const { data: { text } } = await Tesseract.recognize(image, 'eng');
      setOcrResult(text);
      setIsLoading(false);
    } catch (err) {
      setOcrResult('');
      setError('OCR failed: ' + err.message);
      setIsLoading(false);
    }
  };

  // Helper: Extract images from PDF and run OCR on each page
  const processPdf = async (pdfFile) => {
    setIsLoading(true);
    setOcrResult('');
    setError('');
    const fileReader = new FileReader();
    
    fileReader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        
        setOcrResult(fullText);
        setIsLoading(false);
      } catch (err) {
        setOcrResult('');
        setError('PDF processing failed: ' + err.message);
        setIsLoading(false);
      }
    };
    
    fileReader.readAsArrayBuffer(pdfFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Reset file input to allow selecting the same file again
    if (fileInput.current) {
      fileInput.current.value = '';
    }
    
    if (!selectedFile) return;
    
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      setError('File size exceeds the maximum limit of 10MB');
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setOcrResult('');
    setError('');
    
    // Show preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        runOcr(e.target.result);
      };
      reader.onerror = () => {
        setError('Failed to read the image file');
      };
      reader.readAsDataURL(selectedFile);
    } 
    // Process PDF files
    else if (selectedFile.type === 'application/pdf') {
      setPreviewUrl('');
      processPdf(selectedFile);
    } 
    // Unsupported file type
    else {
      setError('Unsupported file type. Please upload an image (JPG, PNG) or PDF file.');
      setFile(null);
      setFileName('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (droppedFile.size > maxSize) {
      setError('File size exceeds the maximum limit of 10MB');
      return;
    }
    
    setFile(droppedFile);
    setFileName(droppedFile.name);
    setOcrResult('');
    setError('');
    
    if (droppedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        runOcr(e.target.result);
      };
      reader.onerror = () => {
        setError('Failed to read the image file');
      };
      reader.readAsDataURL(droppedFile);
    } else if (droppedFile.type === 'application/pdf') {
      setPreviewUrl('');
      processPdf(droppedFile);
    } else {
      setError('Unsupported file type. Please upload an image (JPG, PNG) or PDF file.');
      setFile(null);
      setFileName('');
    }
  };

  const handleSubmitForAnalysis = async () => {
    setSubmitted(true);
    setAnalysis('');
    setError('');
    setIsLoading(true);
    
    try {
      const text = editText || ocrResult;
      if (!text.trim()) {
        throw new Error('Please upload a file or enter text first.');
      }
      
      const prompt = `Analyze this medical report and provide:

1. Summary (concise overview of key findings)
2. Visual Summary (structured metrics with normal ranges)
3. Risk Assessment (potential health risks and severity)
4. Trend Analysis (if multiple reports are available)
5. Personalized Recommendations
6. Actionable Insights
7. Glossary of Medical Terms

Medical Report:
${text}`;

      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt })
      });
      
      const data = await response.json();
      
      if (data.result) {
        setAnalysis(data.result);
        setError('Analysis completed successfully!');
        
        // Parse the analysis to extract sections
        const sections = parseAnalysisSections(data.result);
        const summary = sections.find(s => s.title.toLowerCase().includes('summary'))?.content || '';
        
        // Create a new report object
        const newReport = {
          text: text,
          analysis: data.result,
          summary: summary,
          timestamp: new Date().toISOString(),
          // Extract insights if available
          insights: sections
            .filter(s => s.title.toLowerCase().includes('insight') || 
                        s.title.toLowerCase().includes('recommendation'))
            .map(s => s.content.split('\n')[0])
        };
        
        // Save the report using the context
        addReport(newReport);
      } else {
        throw new Error('No analysis result received');
      }
    } catch (err) {
      setError('Analysis failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle downloading the report
  const handleDownloadReport = () => {
    if (!analysis) return;
    
    // Create a blob with the analysis content
    const blob = new Blob([analysis], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_report_analysis_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Function to handle printing the report
  const handlePrintReport = () => {
    if (!analysis) return;
    
    // Create a print window
    const printWindow = window.open('', '_blank');
    
    // Format the content for printing with markdown-like syntax support
    const formatPrintContent = (text) => {
      if (!text) return '';
      // Replace **text** with <strong>text</strong>
      return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };
    
    // Format the content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Report Analysis</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2176ae; border-bottom: 2px solid #f0f4f8; padding-bottom: 10px; }
          h2 { color: #2c3e50; margin-top: 1.5em; }
          .meta { margin: 10px 0; color: #666; font-size: 0.9em; }
          .section { margin-bottom: 20px; }
          ul, ol { padding-left: 25px; }
          li { margin-bottom: 8px; }
          strong { font-weight: bold; }
          @media print {
            @page { margin: 1cm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Medical Report Analysis</h1>
        <div class="meta">
          <div>Date: ${new Date().toLocaleDateString()}</div>
          <div>Status: Analysis Complete</div>
        </div>
        <div class="report-content">
          ${parseAnalysisSections(analysis).map(section => `
            <div class="section">
              <h2>${section.title}</h2>
              <div>${formatPrintContent(section.content).replace(/\n/g, '<br>')}</div>
            </div>
          `).join('')}
        }
        </div>
        <div class="no-print" style="margin-top: 30px; font-size: 0.9em; color: #999; text-align: center;">
          This document was generated by AI Health Analyzer
        </div>
        <script>
          // Trigger print when the window loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Close the window after printing (with a delay to ensure printing starts)
              setTimeout(function() { window.close(); }, 500);
            }, 200);
          };
        </script>
      </body>
      </html>
    `;
    
    // Write the content to the print window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };
  
  // Function to render analysis sections
  const renderAnalysisSections = (analysis) => {
    const sections = parseAnalysisSections(analysis);
    return sections.map((section, index) => (
      <AnalysisSection key={index} title={section.title} content={section.content} />
    ));
  };

  return (
    <div className="service-page">
      <div className="service-container">
        <div className="service-header">
          <h1>Analyze Your Medical Report</h1>
          <p>Upload your medical report and get a comprehensive analysis.</p>
        </div>

        <div className="service-content">
          <div className="upload-section">
            <div 
              className={`upload-container ${dragActive ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInput.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                style={{ display: 'none' }}
              />
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <p className="upload-text">Drag & drop your file here or <span className="browse-link">browse</span></p>
              <p className="file-types">Supports: JPG, PNG, PDF (Max 10MB)</p>
            </div>
            
            {file && (
              <div className="file-info">
                <p>Selected file: {file.name}</p>
                <button 
                  className="clear-btn"
                  onClick={() => {
                    setFile(null);
                    setFileName('');
                    setOcrResult('');
                    setPreviewUrl('');
                    if (fileInput.current) {
                      fileInput.current.value = '';
                    }
                  }}
                >
                  Clear
                </button>
              </div>
            )}
            
            {/* File Preview */}
            {isLoading ? (
              <div className="file-preview loading-preview">
                <div className="spinner"></div>
                <p>Processing your file...</p>
              </div>
            ) : previewUrl ? (
              <div className="file-preview">
                <h4>Preview:</h4>
                <img 
                  src={previewUrl} 
                  alt="Uploaded preview" 
                  className="preview-image"
                />
              </div>
            ) : file && file.type === 'application/pdf' ? (
              <div className="file-preview pdf-preview">
                <div className="pdf-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <p>PDF file selected</p>
                {isLoading && <p className="processing-text">Processing PDF...</p>}
              </div>
            ) : null}
          </div>

          <div className="text-edit-section">
            <h3>Edit Extracted Text</h3>
            <textarea
              value={editText || ocrResult}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="The extracted text will appear here..."
              rows={10}
              disabled={isLoading}
            />
          </div>

          <div className="analysis-section">
            <button 
              className="analyze-btn" 
              onClick={handleSubmitForAnalysis}
              disabled={isLoading || (!ocrResult && !editText)}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Report'}
            </button>
            
            
            {isLoading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Processing your request...</p>
              </div>
            )}
            
            {analysis && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <p>Analysis completed successfully! Your report is ready below.</p>
              </div>
            )}
            
            {analysis && (
              <div className="analysis-results">
                <div className="analysis-header">
                  <h3><i className="fas fa-clipboard-check"></i> Report Analysis</h3>
                  <div className="report-meta">
                    <span className="report-date">
                      <i className="far fa-calendar-alt"></i> {new Date().toLocaleDateString()}
                    </span>
                    <span className="report-status success">
                      <i className="fas fa-check-circle"></i> Analysis Complete
                    </span>
                  </div>
                </div>
                
                <div className="report-sections">
                  {renderAnalysisSections(analysis)}
                </div>
                
                <div className="report-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleDownloadReport}
                    disabled={!analysis}
                  >
                    <i className="fas fa-download"></i> Download Report
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handlePrintReport}
                    disabled={!analysis}
                  >
                    <i className="fas fa-print"></i> Print
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysePage;
