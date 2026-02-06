import React, { useRef, useState } from 'react';
import { EffortLevel, RecurrenceUnit } from '../types';

interface CsvTaskRow {
  title?: string;
  name?: string;
  effort?: string;
  level?: string;
  interval?: string;
  recurrenceinterval?: string;
  unit?: string;
  recurrenceunit?: string;
}

interface CsvImportProps {
  onAddTask: (task: { title: string; level: EffortLevel; isCustom: true; recurrenceInterval?: number; recurrenceUnit: RecurrenceUnit }) => void;
}

const CsvImport: React.FC<CsvImportProps> = ({ onAddTask }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/);
        if (lines.length < 2) return;

        const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
        let count = 0;

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',').map((v) => v.trim());
          const taskData: CsvTaskRow = {};
          headers.forEach((header, index) => {
            (taskData as Record<string, string | undefined>)[header] = values[index];
          });

          if (taskData.title || taskData.name) {
            let level = EffortLevel.LOW;
            const effortStr = (taskData.effort || taskData.level || '').toLowerCase();
            if (effortStr.includes('medium')) level = EffortLevel.MEDIUM;
            if (effortStr.includes('high')) level = EffortLevel.HIGH;

            const interval = parseInt(taskData.interval || taskData.recurrenceinterval || '1', 10) || 1;
            const unitRaw = (taskData.unit || taskData.recurrenceunit || 'none').toLowerCase();
            const unit: RecurrenceUnit = ['days', 'weeks', 'months', 'years'].includes(unitRaw) ? (unitRaw as RecurrenceUnit) : 'none';

            onAddTask({
              title: taskData.title || taskData.name || '',
              level,
              isCustom: true,
              recurrenceInterval: unit !== 'none' ? interval : undefined,
              recurrenceUnit: unit,
            });
            count++;
          }
        }

        setImportStatus(`Successfully imported ${count} tasks.`);
        setTimeout(() => setImportStatus(null), 3000);
      } catch {
        setImportStatus('Import failed. Check the CSV format and try again.');
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
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
          className="flex-1 py-3 px-4 bg-[#eee8d5]/40 border border-[#eee8d5] rounded-xl text-soft hover:bg-[#eee8d5] hover:text-[#586e75] transition-all text-sm flex items-center justify-center gap-2"
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
