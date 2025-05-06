
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost } from '@/services/api/posts';
import { useToast } from '@/components/ui/use-toast';
import { Post } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditPostDialogProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({ post, isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Initialize form values when post or isOpen changes
  useEffect(() => {
    if (post && isOpen) {
      setTitle(post.title || post.titre || '');
      setContent(post.content || post.contenu || '');
    }
  }, [post, isOpen]);

  const updatePostMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      updatePost(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: t('posts.updateSuccess'),
        description: t('posts.updateSuccessDesc'),
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: t('general.error'),
        description: t('posts.updateError'),
        variant: "destructive",
      });
      console.error('Error updating post:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: t('general.validationError'),
        description: t('posts.emptyFields'),
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    // Use the field names expected by Laravel: titre and contenu
    formData.append('titre', title);
    formData.append('contenu', content);
    
    // Log the form data to verify it's being sent correctly
    console.log("Updating post with data:", {
      id: post.id,
      title: title,
      content: content
    });
    
    updatePostMutation.mutate({
      id: post.id,
      formData: formData
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('posts.editPost')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('posts.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('posts.enterTitle')}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">{t('posts.content')}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('posts.enterContent')}
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={updatePostMutation.isPending}
            >
              {t('carteTechnique.cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? t('posts.saving') : t('posts.saveChanges')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
