
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ListVideo, FileText, Mail } from 'lucide-react';
import { getPosts } from '@/services/api/posts';
import { getPrograms } from '@/services/api/programs';
import { getAnachids } from '@/services/api/anachids';
import { useLanguage } from '@/contexts/LanguageContext';

const PostmanDashboard = () => {
  const { t } = useLanguage();
  
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  const { data: anachids } = useQuery({
    queryKey: ['anachids'],
    queryFn: getAnachids
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms
  });

  const stats = [
    { title: t('dashboard.posts'), value: posts?.length || 0, icon: <Mail className="h-8 w-8 text-pink-500" aria-hidden="true" /> },
    { title: t('dashboard.anachids'), value: anachids?.length || 0, icon: <FileText className="h-8 w-8 text-blue-500" aria-hidden="true" /> },
    { title: t('dashboard.programs'), value: programs?.length || 0, icon: <ListVideo className="h-8 w-8 text-green-500" aria-hidden="true" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{t('dashboard.welcome')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="pointer-events-none">{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostmanDashboard;
