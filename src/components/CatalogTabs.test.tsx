import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CatalogTabs from './CatalogTabs';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ layoutId, className, style, ...props }: any) => (
      <div
        data-testid={layoutId === 'activeCatalogTab' ? 'active-tab-indicator' : 'motion-div'}
        className={className}
        style={style}
        {...props}
      />
    ),
  },
}));

describe('CatalogTabs', () => {
  const mockProps = {
    view: 'tasks' as const,
    onViewChange: vi.fn(),
    hasArchivedTasks: false,
  };

  it('renders tasks and report tabs by default', () => {
    render(<CatalogTabs {...mockProps} />);

    expect(screen.getByRole('tab', { name: /tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /report/i })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /archive/i })).not.toBeInTheDocument();
  });

  it('renders archive tab when hasArchivedTasks is true', () => {
    render(<CatalogTabs {...mockProps} hasArchivedTasks={true} />);

    expect(screen.getByRole('tab', { name: /archive/i })).toBeInTheDocument();
  });

  it('calls onViewChange when tab is clicked', () => {
    render(<CatalogTabs {...mockProps} hasArchivedTasks={true} />);

    fireEvent.click(screen.getByRole('tab', { name: /report/i }));
    expect(mockProps.onViewChange).toHaveBeenCalledWith('report');

    fireEvent.click(screen.getByRole('tab', { name: /archive/i }));
    expect(mockProps.onViewChange).toHaveBeenCalledWith('archive');

    fireEvent.click(screen.getByRole('tab', { name: /tasks/i }));
    expect(mockProps.onViewChange).toHaveBeenCalledWith('tasks');
  });

  it('highlights active tab', () => {
    const { rerender } = render(<CatalogTabs {...mockProps} view="tasks" />);
    expect(screen.getByRole('tab', { name: /tasks/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /report/i })).toHaveAttribute('aria-selected', 'false');

    rerender(<CatalogTabs {...mockProps} view="report" />);
    expect(screen.getByRole('tab', { name: /tasks/i })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: /report/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders active tab indicator only on the selected tab', () => {
    const { rerender } = render(<CatalogTabs {...mockProps} view="tasks" />);

    const tasksTab = screen.getByRole('tab', { name: /tasks/i });
    const reportTab = screen.getByRole('tab', { name: /report/i });

    expect(tasksTab).toContainElement(screen.getByTestId('active-tab-indicator'));
    expect(reportTab).not.toContainElement(screen.queryByTestId('active-tab-indicator') as HTMLElement);

    rerender(<CatalogTabs {...mockProps} view="report" />);

    expect(reportTab).toContainElement(screen.getByTestId('active-tab-indicator'));
    expect(tasksTab).not.toContainElement(screen.queryByTestId('active-tab-indicator') as HTMLElement);
  });
});
