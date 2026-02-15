import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CatalogReport from './CatalogReport';
import { useCatalogStats } from '../hooks/useCatalogStats';
import { EffortLevel } from '../types';

vi.mock('../hooks/useCatalogStats');


describe('CatalogReport', () => {
  it('renders empty state when no tasks', () => {
    (useCatalogStats as any).mockReturnValue({
      hasActivityToday: false,
      effortDist: {},
      recurrenceDist: {},
      totalDone: {},
      totalLeft: {},
      registeredUnits: new Set()
    });

    render(<CatalogReport tasks={[]} />);

    expect(screen.getByText('No data to report.')).toBeInTheDocument();
  });

  it('renders report components with correct data when tasks exist', () => {
    const mockStats = {
      hasActivityToday: true,
      effortDist: { [EffortLevel.LOW]: 5 },
      recurrenceDist: { days: 2 },
      totalDone: { [EffortLevel.LOW]: 10 },
      totalLeft: { [EffortLevel.LOW]: 5 },
      registeredUnits: new Set(['days'])
    };

    (useCatalogStats as any).mockReturnValue(mockStats);

    render(<CatalogReport tasks={[{ id: '1' } as any]} />);


    expect(screen.getByText("Today's Activity")).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Low effort count

    expect(screen.getByText('Catalog Health')).toBeInTheDocument();
    expect(screen.getByText('10 done')).toBeInTheDocument();
    expect(screen.getByText('5 left')).toBeInTheDocument();
  });
});
