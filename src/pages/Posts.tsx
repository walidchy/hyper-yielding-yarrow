import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, deletePost } from '@/services/api/posts';
import { format } from 'date-fns';
import { ThumbsUp, Share2, MoreHorizontal, Trash2, Edit, Plus, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import PostFormDialog from '@/components/posts/PostFormDialog';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { shareToSocialMedia, copyToClipboard } from '@/utils/shareUtils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Posts = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: t('posts.deleteSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('posts.deleteError'),
        variant: "destructive",
      });
    }
  });

  const handleDeletePost = (postId: number) => {
    if (window.confirm(t('posts.confirmDelete'))) {
      deletePostMutation.mutate(postId);
    }
  };

  const handleEditPost = (post: Post) => {
    setPostToEdit(post);
    setIsFormOpen(true);
  };

  const canModifyPost = (post: Post) => {
    return user && (
      user.role === 'postman' || 
      (post.user && user.id === post.user.id) || 
      (post.author_id && user.id === post.author_id)
    );
  };

  const getImageUrl = (imageUrl: string) => {
    return `http://localhost:8000/storage/${imageUrl}`;
  };

  const handleShare = async (post: Post, platform: 'facebook' | 'twitter' | 'linkedin') => {
    const shareData = {
      title: post.title || post.titre || '',
      text: post.content || post.contenu || '',
      url: window.location.href,
    };
    
    shareToSocialMedia(platform, shareData);
  };

  const handleCopyLink = async (post: Post) => {
    const url = `${window.location.origin}/posts/${post.id}`;
    const success = await copyToClipboard(url);
    
    if (success) {
      toast({
        title: t('posts.linkCopied'),
      });
    } else {
      toast({
        title: t('posts.copyError'),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-blue-500">{t('general.loading')}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('posts.title')}</h1>
          {user?.role === 'postman' && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('posts.createPost')}
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          {posts?.map((post) => (
            <Card key={post.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.user?.profile_picture || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04'} 
                      alt={post.user?.name || t('general.anonymous')}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.user?.name || t('general.anonymous')}</h3>
                      <p className="text-xs text-gray-500">
                        {format(new Date(post.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>

                  {canModifyPost(post) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPost(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>{t('general.edit')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>{t('general.delete')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-medium mb-2">{post.title || post.titre}</h2>
                  <p className="text-gray-700 whitespace-pre-line mb-4">{post.content || post.contenu}</p>
                  
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <img
                          key={image.id}
                          src={getImageUrl(image.image_url)}
                          alt=""
                          className="w-full h-48 md:h-64 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex border-t border-gray-100 mt-2 pt-3 text-gray-600">
                    <Button variant="ghost" className="flex-1 rounded-md">
                      <ThumbsUp className="mr-2 h-5 w-5" />
                      <span>{t('posts.like')}</span>
                    </Button>

                    {navigator.share ? (
                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-md"
                        onClick={() => {
                          const shareData = {
                            title: post.title || post.titre || '',
                            text: post.content || post.contenu || '',
                            url: `${window.location.origin}/posts/${post.id}`,
                          };
                          
                          navigator.share(shareData).catch(err => 
                            console.error('Error sharing:', err)
                          );
                        }}
                      >
                        <Share2 className="mr-2 h-5 w-5" />
                        <span>{t('posts.share')}</span>
                      </Button>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="flex-1 rounded-md">
                            <Share2 className="mr-2 h-5 w-5" />
                            <span>{t('posts.share')}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2">
                          <div className="flex flex-col space-y-1">
                            <Button 
                              variant="ghost" 
                              className="justify-start" 
                              onClick={() => handleShare(post, 'facebook')}
                            >
                              <Facebook className="mr-2 h-4 w-4" />
                              Facebook
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start" 
                              onClick={() => handleShare(post, 'twitter')}
                            >
                              <Twitter className="mr-2 h-4 w-4" />
                              Twitter
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start" 
                              onClick={() => handleShare(post, 'linkedin')}
                            >
                              <Linkedin className="mr-2 h-4 w-4" />
                              LinkedIn
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="justify-start" 
                              onClick={() => handleCopyLink(post)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Link
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <PostFormDialog
          post={postToEdit || undefined}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setPostToEdit(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default Posts;
