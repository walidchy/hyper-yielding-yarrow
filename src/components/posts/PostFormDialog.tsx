
import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createPost, updatePost } from '@/services/api/posts';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
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
import { Image, Plus, X } from 'lucide-react';

interface PostFormDialogProps {
  post?: Post;
  isOpen: boolean;
  onClose: () => void;
}

const PostFormDialog: React.FC<PostFormDialogProps> = ({ post, isOpen, onClose }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [images, setImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: t('posts.createSuccess') });
      handleClose();
    },
    onError: () => {
      toast({ title: t('posts.createError'), variant: "destructive" });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: (data: { id: number; formData: FormData }) => 
      updatePost(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: t('posts.updateSuccess') });
      handleClose();
    },
    onError: () => {
      toast({ title: t('posts.updateError'), variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: t('posts.validation'),
        description: t('posts.fillAllFields'),
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('titre', title);
    formData.append('contenu', content);
    if (user) {
      formData.append('user_id', user.id.toString());
    }

    images.forEach(image => {
      formData.append('images[]', image);
    });

    if (post) {
      if (imagesToDelete.length > 0) {
        formData.append('delete_image_ids', JSON.stringify(imagesToDelete));
      }
      updatePostMutation.mutate({ id: post.id, formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setImages([]);
    setImagesToDelete([]);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setImagesToDelete([...imagesToDelete, imageId]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {post ? t('posts.editPost') : t('posts.createPost')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('posts.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('posts.titlePlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">{t('posts.content')}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('posts.contentPlaceholder')}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('posts.images')}</Label>
            <div className="flex flex-wrap gap-2">
              {post?.images?.map((image, index) => (
                !imagesToDelete.includes(image.id) && (
                  <div key={image.id} className="relative">
                    <img
                      src={`/storage/${image.image_url}`}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              ))}
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-primary">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <Plus className="h-6 w-6 text-gray-400" />
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={createPostMutation.isPending || updatePostMutation.isPending}
            >
              {t('general.cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={createPostMutation.isPending || updatePostMutation.isPending}
            >
              {createPostMutation.isPending || updatePostMutation.isPending
                ? t('general.saving')
                : post ? t('general.save') : t('general.create')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostFormDialog;
