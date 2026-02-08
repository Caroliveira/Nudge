import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CsvImport from './CsvImport';
import Papa from 'papaparse';
import { useStore } from '../store/useStore';
import { EffortLevel } from '../types';

vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn()
  }
}));

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));


describe('CsvImport', () => {
  const mockAddTask = vi.fn();
  const mockTasks: any[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      tasks: mockTasks,
      addTask: mockAddTask
    });
  });

  it('renders import button and template link', () => {
    render(<CsvImport />);
    expect(screen.getByText('Import CSV')).toBeInTheDocument();
    expect(screen.getByText('Get CSV Template')).toBeInTheDocument();
  });

  it('handles file selection and adds tasks on success', async () => {
    const user = userEvent.setup();
    render(<CsvImport />);
    
    const file = new File(['content'], 'tasks.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Import CSV file');

    (Papa.parse as any).mockImplementation((file: any, config: any) => {
        config.complete({ 
          data: [
            { title: 'Task 1', effort: 'Low', interval: '1', unit: 'days' }
          ], 
          meta: { 
            fields: ['title', 'effort', 'interval', 'unit'] 
          } 
        });
    });

    await user.upload(input, file);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Task 1',
        level: EffortLevel.LOW
      }));
      expect(screen.getByText(/Successfully imported 1 tasks/)).toBeInTheDocument();
    });
  });

  it('shows error for invalid headers', async () => {
    const user = userEvent.setup();
    render(<CsvImport />);
    
    const file = new File(['content'], 'tasks.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Import CSV file');

    (Papa.parse as any).mockImplementation((file: any, config: any) => {
        config.complete({ 
          data: [], 
          meta: { 
            fields: ['wrong', 'headers'] 
          } 
        });
    });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/Invalid CSV format/)).toBeInTheDocument();
      expect(mockAddTask).not.toHaveBeenCalled();
    });
  });

  it('displays skipped count message', async () => {
    const user = userEvent.setup();
    (useStore as any).mockReturnValue({
      tasks: [{ title: 'Existing Task' }],
      addTask: mockAddTask
    });

    render(<CsvImport />);
    
    const file = new File(['content'], 'tasks.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Import CSV file');

    (Papa.parse as any).mockImplementation((file: any, config: any) => {
        config.complete({ 
          data: [
            { title: 'Existing Task', effort: 'Low', interval: '1', unit: 'days' },
            { title: 'Existing Task', effort: 'Low', interval: '1', unit: 'days' }
          ], 
          meta: { 
            fields: ['title', 'effort', 'interval', 'unit'] 
          } 
        });
    });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/2 duplicates skipped/)).toBeInTheDocument();
      expect(mockAddTask).not.toHaveBeenCalled();
    });
  });
});
