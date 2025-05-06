
import api from '@/utils/api';
import { Member } from '@/types';

export const getUsers = async (): Promise<Member[]> => {
  try {
    const response = await api.get('/users');
    if (!response.data) return [];
    return Array.isArray(response.data) ? response.data : 
           (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getMembers = async (): Promise<Member[]> => {
  return getUsers();
};

export const createUser = async (userData: Partial<Member>) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: Partial<Member>) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    if (response.data && response.data.success === true && response.data.data && response.data.data.user) {
      return response.data.data.user;
    }
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserCountByRoles = async (): Promise<{ role: string; total: number }[]> => {
  try {
    const response = await api.get('/users/count-by-roles');
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user counts by roles:', error);
    return [];
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/user');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: any) => {
  try {
    if (!profileData.id) {
      throw new Error('User ID is required to update profile');
    }
    const response = await api.put(`/users/${profileData.id}`, profileData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateProfilePicture = async (file: File, id: number) => {
  try {
    // Convert image to base64
    const toBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    const base64Image = await toBase64(file);

    const payload = {
      profile_picture: base64Image,
    };

    const response = await api.put(`/users/${id}`, payload);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};
