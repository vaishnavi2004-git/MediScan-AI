import React, { useEffect, useState } from 'react';

function parseMetricsFromReport(report) {
  // Fallback for when no visualSummary exists. Extract all lines with 'Name: value' pattern.
  const metrics = [];
  const source = report.summary || report.raw || '';
  source.split('\n').forEach(line => {
    // Try to match: Name: value [unit] (status, Normal: X-Y)
    const match = line.match(/^([A-Za-z0-9_\- ]+):\s*([\d.]+)[^\d]*(?:\(([^)]*)\))?/i);
    if (match) {
      const name = match[1].trim();
      const value = parseFloat(match[2]);
      let status = undefined;
      let normalMin, normalMax, normalRaw;

      // Default normal ranges for common blood tests
      const normalRanges = {
        'Haemoglobin': { min: 13.8, max: 17.2 }, // g/dL for men
        'Total WBC Count': { min: 4.0, max: 11.0 }, // x10^3/µL
        'Packed Cell Volume': { min: 40, max: 50 }, // %
        'Mean Corpuscular Volume': { min: 80, max: 100 }, // fL
        'Mean Corpuscular Hemoglobin': { min: 27, max: 31 }, // pg
        'Neutrophils': { min: 40, max: 75 }, // %
        'Lymphocytes': { min: 20, max: 40 }, // %
        'Eosinophil': { min: 1, max: 6 }, // %
        'Monocytes': { min: 2, max: 10 }, // %
        'Basophils': { min: 0, max: 2 }, // %
        'Platelets': { min: 150, max: 450 }, // x10^3/µL
      };

      // Get normal range from match or use default if available
      if (match[3]) {
        const normalMatch = match[3].match(/Normal:?\s*([\d.]+)(?:\s*-\s*([\d.]+))?/i);
        if (normalMatch) {
          normalMin = parseFloat(normalMatch[1]);
          normalMax = normalMatch[2] ? parseFloat(normalMatch[2]) : normalMin;
          normalRaw = normalMatch[2] ? `${normalMatch[1]}-${normalMatch[2]}` : normalMatch[1];
        }
      }

      // If no normal range found, use default
      if (normalMin === undefined && normalMax === undefined) {
        const defaultRange = normalRanges[name];
        if (defaultRange) {
          normalMin = defaultRange.min;
          normalMax = defaultRange.max;
          normalRaw = `${normalMin}-${normalMax}`;
        }
      }

      // Calculate status if not provided
      if (value !== undefined && normalMin !== undefined && normalMax !== undefined) {
        if (value < normalMin) status = 'Low';
        else if (value > normalMax) status = 'High';
        else status = 'Normal';
      }

      metrics.push({ name, value, status, normalMin, normalMax, normalRaw });
    }
  });
  return metrics;
}

function parseMetricsFromVisualSummary(visualSummary) {
  // Match lines like:
  // 'Hemoglobin: 12.5 g/dL (Low, Normal: 13.5-17.5)'
  // 'Cholesterol: 210 mg/dL (High, Normal: 200)'
  // 'Lymphocytes: 52% (Normal: 20-40)'
  const metrics = [];
  if (!visualSummary) return metrics;
  visualSummary.split('\n').forEach(line => {
    // Name: value [unit] (status, Normal: X-Y)
    const match = line.match(/^([A-Za-z0-9_\- ]+):\s*([\d.]+)[^\d]*(?:\(([^)]*)\))?/i);
    if (match) {
      const name = match[1].trim();
      const value = parseFloat(match[2]);
      let status, normalMin, normalMax, normalRaw;
      if (match[3]) {
        // Parse status and normal range from inside parens
        const statusMatch = match[3].match(/^(Low|High|Normal|Abnormal)/i);
        status = statusMatch ? statusMatch[1] : undefined;
        const normalMatch = match[3].match(/Normal:?\s*([\d.]+)(?:\s*-\s*([\d.]+))?/i);
        if (normalMatch) {
          normalMin = parseFloat(normalMatch[1]);
          normalMax = normalMatch[2] ? parseFloat(normalMatch[2]) : normalMin;
          normalRaw = normalMatch[2] ? `${normalMatch[1]}-${normalMatch[2]}` : normalMatch[1];
        }
      }
      metrics.push({ name, value, status, normalMin, normalMax, normalRaw });
    }
  });
  return metrics;
}

function VisualSummaries({ report }) {
  if (!report) {
    return <section><h3>Visual Summaries</h3><div style={{color:'gray'}}>No report data available for visualization.</div></section>;
  }
  let metrics = [];
  if (report.visualSummary) {
    metrics = parseMetricsFromVisualSummary(report.visualSummary);
  } else {
    metrics = parseMetricsFromReport(report);
  }
  if (!metrics.length) {
    return <section><h3>Visual Summaries</h3><div style={{color:'gray'}}>No metrics found in this report for visualization.</div></section>;
  }

  // Add more detailed status information
  const withStatus = metrics.map(m => {
    let status = m.status;
    if (m.value !== undefined && m.normalMin !== undefined && m.normalMax !== undefined) {
      const value = m.value;
      const min = m.normalMin;
      const max = m.normalMax;
      
      // Calculate percentage deviation from normal range
      const deviation = value < min 
        ? ((min - value) / min) * 100
        : ((value - max) / max) * 100;
      
      // Add severity level to status
      if (value < min) {
        status = `Low (${deviation.toFixed(1)}%)`;
      } else if (value > max) {
        status = `High (${deviation.toFixed(1)}%)`;
      } else {
        status = 'Normal';
      }
    }
    return { ...m, status };
  });

  // Sort: abnormal first
  const abnormalFirst = [...withStatus].sort((a, b) => {
    const aAbn = a.status && /low|high|abnormal/i.test(a.status);
    const bAbn = b.status && /low|high|abnormal/i.test(b.status);
    return (bAbn ? 1 : 0) - (aAbn ? 1 : 0);
  });

  // Color by status
  const statusColor = status => {
    if (!status) return '#2176ae';
    if (/low/i.test(status)) return '#f7b801'; // orange
    if (/high/i.test(status)) return '#e74c3c'; // red
    if (/normal/i.test(status)) return '#2ecc40'; // green
    if (/abnormal/i.test(status)) return '#e67e22'; // dark orange
    return '#2176ae'; // default blue
  };

  const cellStyle = status => ({
    background: statusColor(status),
    color: '#222',
    fontWeight: /high|low|abnormal/i.test(status) ? 600 : 400,
    padding: '0.5em 1em',
    borderRadius: '0.5em',
    textAlign: 'center',
    minWidth: 80
  });

  return (
    <section>
      <h3>Visual Summaries</h3>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'separate', borderSpacing:'0 0.5em', marginTop:'1em'}}>
          <thead>
            <tr style={{background:'#f8fbfd'}}>
              <th style={{padding:'0.5em 1em'}}>Metric</th>
              <th style={{padding:'0.5em 1em'}}>Value</th>
              <th style={{padding:'0.5em 1em'}}>Normal Range</th>
              <th style={{padding:'0.5em 1em'}}>Status</th>
              <th style={{padding:'0.5em 1em'}}>Deviation</th>
            </tr>
          </thead>
          <tbody>
            {abnormalFirst.map((m, i) => (
              <tr key={m.name + i}>
                <td style={{padding:'0.5em 1em', fontWeight:600}}>{m.name}</td>
                <td style={cellStyle(m.status)}>{m.value != null ? m.value : '-'}</td>
                <td style={cellStyle(m.status)}>{m.normalRaw ? m.normalRaw : (m.normalMin !== undefined && m.normalMax !== undefined ? `${m.normalMin}-${m.normalMax}` : '-')}</td>
                <td style={cellStyle(m.status)}>{m.status || '-'}</td>
                <td style={cellStyle(m.status)}>{m.status && /Low|High/.test(m.status) ? `(${m.value} ${m.status.includes('Low') ? '<' : '>'} ${m.normalMin || m.normalMax})` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '1em', color: '#666' }}>
        <small>
          <span style={{ color: '#e74c3c', fontWeight: 600 }}>Red</span> = High,
          <span style={{ color: '#f7b801', fontWeight: 600 }}> Orange</span> = Low,
          <span style={{ color: '#2ecc40', fontWeight: 600 }}> Green</span> = Normal,
          <span style={{ color: '#2176ae', fontWeight: 600 }}> Blue</span> = Other.
        </small>
      </div>
    </section>
  );
}

export default VisualSummaries;
