import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CatalogHealth from './CatalogReportHealth';
import { EffortLevel } from '../types';

describe('CatalogHealth', () => {
  const mockStats = {
    totalDone: {
      [EffortLevel.LOW]: 5,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 2,
    },
    totalLeft: {
      [EffortLevel.LOW]: 5,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 8,
    },
  };

  it('renders health stats correctly', () => {
    render(<CatalogHealth stats={mockStats} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('5 done')).toBeInTheDocument();
    expect(screen.getByText('5 left')).toBeInTheDocument();

    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('2 done')).toBeInTheDocument();
    expect(screen.getByText('8 left')).toBeInTheDocument();

    expect(screen.getAllByText('0%')).toHaveLength(1);
    expect(screen.getAllByText('0 done')).toHaveLength(1);
    expect(screen.getAllByText('0 left')).toHaveLength(1);
  });
});
