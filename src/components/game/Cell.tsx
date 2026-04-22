'use client';

import React from 'react';
import { Player } from '@/types/game';

interface CellProps {
  index: number;
  value: Player | null;
  preview: Player | null;
  isWinningCell: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ 
  index, 
  value, 
  preview, 
  isWinningCell, 
  isLocked, 
  onClick 
}) => {
  const cellClass = `cell ${value ? value.toLowerCase() : ''} ${isWinningCell ? 'winner' : ''} ${isLocked ? 'locked' : ''} ${!value && !isLocked ? `preview-${preview?.toLowerCase()}` : ''}`;

  return (
    <div 
      className={cellClass} 
      data-index={index}
      data-preview={!value && !isLocked ? preview : undefined}
      onClick={onClick}
    >
      {value && <span>{value}</span>}
    </div>
  );
};
