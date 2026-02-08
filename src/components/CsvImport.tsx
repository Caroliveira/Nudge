import React, { useRef, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CsvTaskRow } from '../types';
import { useStore } from '../store/useStore';
import { IMPORT_CONFIG } from '../constants';
import { validateHeaders, processImportedTasks } from '../utils/csvUtils';


const CsvImport: React.FC = () => {
  const { tasks, addTask } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!importStatus) return;
    const timer = setTimeout(() => {
      setImportStatus(null);
    }, IMPORT_CONFIG.STATUS_MESSAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [importStatus]);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > IMPORT_CONFIG.MAX_FILE_SIZE_BYTES) {
        setImportStatus('File too large. Maximum size is 1MB.');
        return;
    }

    Papa.parse<CsvTaskRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (results) => {
        try {
          const { data, meta } = results;
          
          const headers = meta.fields || [];
          if (!validateHeaders(headers)) {
            setImportStatus(`Invalid CSV format. Required headers: title, effort, interval, unit`);
            return;
          }

          const { tasksToAdd, skippedCount, count } = processImportedTasks(data, tasks);

          tasksToAdd.forEach(task => addTask(task));

          const skippedMsg = skippedCount > 0 ? ` (${skippedCount} duplicates skipped)` : '';
          setImportStatus(`Successfully imported ${count} tasks${skippedMsg}.`);
        } catch {
          setImportStatus('Import failed. Check the CSV format and try again.');
        }
      },
      error: () => {
        setImportStatus('Import failed. Check the CSV format and try again.');
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
          aria-label="Import CSV file"
        />
      </div>
      {importStatus && (
        <p className="text-center text-accent text-sm font-medium animate-pulse">{importStatus}</p>
      )}
    </div>
  );
};

export default CsvImport;
