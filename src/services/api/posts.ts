
import api from '@/utils/api';
import { Post } from '@/types';

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts');
     return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const createPost = async (formData: FormData): Promise<Post | null> => {
  try {
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPost = async (id: number): Promise<Post | null> => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export const updatePost = async (id: number, formData: FormData): Promise<Post | null> => {
  try {
    // For Laravel with FormData, use POST method with the _method parameter
    formData.append('_method', 'PUT');
    
    const response = await api.post(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  try {
    await api.delete(`/posts/${id}`);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
