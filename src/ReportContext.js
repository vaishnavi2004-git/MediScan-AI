import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';

export const ReportContext = createContext({
  reports: [],
  currentReport: null,
  comparison: { report1: null, report2: null },
  addReport: () => {},
  getReport: () => {},
  setReportsForComparison: () => {},
  clearComparison: () => {},
  setCurrentReport: () => {},
  getSortedReports: () => [],
  compareReportsData: () => ({})
});

export function ReportProvider({ children }) {
  // Load reports from localStorage on mount
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('reports');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load reports from localStorage:', error);
      return [];
    }
  });

  // Current report state
  const [currentReport, setCurrentReport] = useState(null);
  const [comparison, setComparison] = useState({
    report1: null,
    report2: null
  });

  // Save reports to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('reports', JSON.stringify(reports));
    } catch (error) {
      console.error('Failed to save reports to localStorage:', error);
    }
  }, [reports]);

  // Add a new report
  const addReport = useCallback((reportData) => {
    if (!reportData) return;
    
    const newReport = {
      ...reportData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      // Ensure summary and insights exist
      summary: reportData.summary || 'No summary available',
      insights: Array.isArray(reportData.insights) ? reportData.insights : []
    };
    
    setReports(prevReports => {
      // Keep only the last 10 reports
      const updatedReports = [newReport, ...prevReports].slice(0, 10);
      return updatedReports;
    });
    
    setCurrentReport(newReport);
    return newReport;
  }, []);

  // Get a report by ID
  const getReport = useCallback((id) => {
    if (!id) return null;
    return reports.find(report => report.id === id || report.timestamp === id);
  }, [reports]);

  // Set reports for comparison
  const setReportsForComparison = useCallback((report1, report2) => {
    if (!report1 || !report2) return;
    
    const report1Data = typeof report1 === 'number' ? getReport(report1) : report1;
    const report2Data = typeof report2 === 'number' ? getReport(report2) : report2;
    
    if (!report1Data || !report2Data) return;
    
    setComparison({
      report1: report1Data,
      report2: report2Data
    });
  }, [getReport]);

  // Clear comparison
  const clearComparison = useCallback(() => {
    setComparison({ report1: null, report2: null });
  }, []);

  // Get all reports sorted by date (newest first)
  const getSortedReports = useCallback(() => {
    return [...reports].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [reports]);

  // Compare two reports and find differences
  const compareReportsData = useCallback((report1, report2) => {
    if (!report1 || !report2) return null;
    
    const report1Data = typeof report1 === 'number' ? getReport(report1) : report1;
    const report2Data = typeof report2 === 'number' ? getReport(report2) : report2;
    
    if (!report1Data || !report2Data) return null;
    
    // Simple comparison logic - can be enhanced based on requirements
    const differences = {
      // Add comparison logic here
      // Example: Compare analysis sections, metrics, etc.
    };
    
    return {
      report1: report1Data,
      report2: report2Data,
      differences,
      comparisonDate: new Date().toISOString()
    };
  }, [getReport]);

  // Context value
  const value = useMemo(() => ({
    reports: getSortedReports(),
    currentReport,
    comparison,
    addReport,
    getReport,
    setReportsForComparison,
    clearComparison,
    setCurrentReport: (report) => {
      if (typeof report === 'number') {
        setCurrentReport(getReport(report));
      } else {
        setCurrentReport(report);
      }
    },
    getSortedReports,
    compareReportsData
  }), [
    reports,
    currentReport,
    comparison,
    addReport,
    getReport,
    setReportsForComparison,
    clearComparison,
    getSortedReports,
    compareReportsData
  ]);

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
}
