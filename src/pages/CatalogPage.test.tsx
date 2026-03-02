import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CatalogPage from './CatalogPage';

vi.mock('../hooks/useTaskActions', () => ({
  useTaskActions: () => ({
    backToSelection: vi.fn(),
  }),
}));

vi.mock('../components/CatalogTasks', () => ({
  default: () => <div data-testid="catalog-tasks-panel">Tasks Panel</div>,
}));

vi.mock('../components/CatalogReport', () => ({
  default: () => <div data-testid="catalog-report">Report</div>,
}));

describe('CatalogPage query-tab sync', () => {
  const LocationSearch = () => {
    const location = useLocation();
    return <div data-testid="location-search">{location.search}</div>;
  };

  it('starts in report view from URL query', () => {
    render(
      <MemoryRouter initialEntries={['/catalog?view=report']}>
        <Routes>
          <Route path="/catalog" element={<><CatalogPage /><LocationSearch /></>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('catalog-report')).toBeInTheDocument();
    expect(screen.queryByTestId('catalog-tasks-panel')).not.toBeInTheDocument();
    expect(screen.getByTestId('location-search')).toHaveTextContent('?view=report');
  });

  it('updates URL and content when switching tabs', () => {
    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <Routes>
          <Route path="/catalog" element={<><CatalogPage /><LocationSearch /></>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('tab', { name: /report/i }));
    expect(screen.getByTestId('catalog-report')).toBeInTheDocument();
    expect(screen.getByTestId('location-search')).toHaveTextContent('?view=report');

    fireEvent.click(screen.getByRole('tab', { name: /tasks/i }));
    expect(screen.getByTestId('catalog-tasks-panel')).toBeInTheDocument();
    expect(screen.getByTestId('location-search')).toHaveTextContent('');
  });
});
