import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { EffortLevel, RecurrenceUnit } from '../types';
import { useStore } from '../store/useStore';

interface CsvTaskRow {
  title: string;
  effort: string;
  interval: string;
  unit: string;
}

const CsvImport: React.FC = () => {
  const { tasks, addTask } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => {
        try {
          const { data, meta } = results;
          
          // Validate headers
          const requiredHeaders = ['title', 'effort', 'interval', 'unit'];
          const headers = meta.fields || [];
          const hasAllHeaders = requiredHeaders.every(h => headers.includes(h));

          if (!hasAllHeaders) {
            setImportStatus(`Invalid CSV format. Required headers: ${requiredHeaders.join(', ')}`);
            setTimeout(() => setImportStatus(null), 5000);
            return;
          }

          let count = 0;
          let skippedCount = 0;

          data.forEach((taskData: CsvTaskRow) => {
            // Strict check for all required fields
            if (
              taskData.title && 
              taskData.effort && 
              taskData.interval && 
              taskData.unit
            ) {
              const title = taskData.title.trim();
              const isDuplicate = tasks.some((t) => t.title.toLowerCase() === title.toLowerCase());

              if (isDuplicate) {
                skippedCount++;
                return;
              }

              let level = EffortLevel.LOW;
              const effortStr = taskData.effort.toLowerCase();
              if (effortStr.includes('medium')) level = EffortLevel.MEDIUM;
              if (effortStr.includes('high')) level = EffortLevel.HIGH;

              const interval = parseInt(taskData.interval, 10);
              const unitRaw = taskData.unit.toLowerCase();
              const unit: RecurrenceUnit = ['days', 'weeks', 'months', 'years'].includes(unitRaw) ? (unitRaw as RecurrenceUnit) : 'none';

              if (unit !== 'none' && (isNaN(interval) || interval <= 0)) return;

              addTask({
                title,
                level,
                recurrenceInterval: unit !== 'none' ? interval : undefined,
                recurrenceUnit: unit,
              });
              count++;
            }
          });

          const skippedMsg = skippedCount > 0 ? ` (${skippedCount} duplicates skipped)` : '';
          setImportStatus(`Successfully imported ${count} tasks${skippedMsg}.`);
          setTimeout(() => setImportStatus(null), 3000);
        } catch (err) {
          console.error('Import processing error:', err);
          setImportStatus('Import failed. Check the CSV format and try again.');
          setTimeout(() => setImportStatus(null), 5000);
        }
      },
      error: (error) => {
        console.error('CSV Parse Error:', error);
        setImportStatus('Import failed. Check the CSV format and try again.');
        setTimeout(() => setImportStatus(null), 5000);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,title,effort,interval,unit\nRead a book,Low,1,days\nDeep Work Session,High,1,weeks';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'nudge_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-3 px-4 bg-surface/40 border border-surface rounded-xl text-soft hover:bg-surface hover:text-text transition-all text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import CSV
        </button>
        <button
          type="button"
          onClick={downloadTemplate}
          className="py-3 px-4 text-soft hover:text-accent transition-all text-xs underline underline-offset-4"
        >
          Get CSV Template
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportCSV}
          accept=".csv"
          className="hidden"
        />
      </div>
      {importStatus && (
        <p className="text-center text-accent text-sm font-medium animate-pulse">{importStatus}</p>
      )}
    </div>
  );
};

export default CsvImport;
