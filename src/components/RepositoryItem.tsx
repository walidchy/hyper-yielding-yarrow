
import React from 'react';
import { FileIcon, FolderIcon, StarIcon } from 'lucide-react';

export interface RepositoryItemType {
  id: string;
  name: string;
  type: 'file' | 'folder';
  starred: boolean;
  updatedAt: string;
}

interface RepositoryItemProps {
  item: RepositoryItemType;
  onStar: (id: string) => void;
}

const RepositoryItem: React.FC<RepositoryItemProps> = ({ item, onStar }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {item.type === 'folder' ? (
            <FolderIcon className="h-6 w-6 text-blue-500" />
          ) : (
            <FileIcon className="h-6 w-6 text-gray-500" />
          )}
          <span className="font-medium">{item.name}</span>
        </div>
        <button 
          onClick={() => onStar(item.id)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <StarIcon 
            className={`h-5 w-5 ${item.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Last updated: {new Date(item.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default RepositoryItem;
