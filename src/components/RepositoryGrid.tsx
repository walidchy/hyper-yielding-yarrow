
import React from 'react';
import RepositoryItem, { RepositoryItemType } from './RepositoryItem';

interface RepositoryGridProps {
  items: RepositoryItemType[];
  onStar: (id: string) => void;
}

const RepositoryGrid: React.FC<RepositoryGridProps> = ({ items, onStar }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <RepositoryItem key={item.id} item={item} onStar={onStar} />
      ))}
    </div>
  );
};

export default RepositoryGrid;
