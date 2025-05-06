
import React, { useState } from 'react';
import Layout from '../components/Layout';
import RepositoryGrid from '../components/RepositoryGrid';
import { generateSampleRepositoryData } from '../utils/repositoryData';
import { RepositoryItemType } from '../components/RepositoryItem';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [items, setItems] = useState<RepositoryItemType[]>(generateSampleRepositoryData());

  const handleStar = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newValue = !item.starred;
          toast({
            title: newValue ? "Item starred" : "Item unstarred",
            description: `${item.name} has been ${newValue ? "added to" : "removed from"} your starred items.`,
            duration: 3000,
          });
          return { ...item, starred: newValue };
        }
        return item;
      })
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Repository Items</h2>
        <p className="text-gray-600">Browse and manage your files and folders.</p>
      </div>
      <RepositoryGrid items={items} onStar={handleStar} />
    </Layout>
  );
};

export default Index;
