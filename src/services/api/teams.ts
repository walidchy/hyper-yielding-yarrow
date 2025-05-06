
import api from '@/utils/api';
import { Team } from '@/types';

export const getTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get('/teams');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeam = async (id: number): Promise<Team> => {
  const response = await api.get(`/teams/${id}`);
  return response.data.data;
};

export const createTeam = async (data: {
  educateur_id: number;
  enfant_id: number[];
  phase_id: number;
  chef_id: number;
}) => {
  const response = await api.post('/teams', data);
  return response.data.data;
};

export const updateTeam = async (id: number, data: {
  educateur_id?: number;
  phase_id?: number;
  chef_id?: number;
}) => {
  const response = await api.put(`/teams/${id}`, data);
  return response.data.data;
};

export const updateTeamChildren = async (teamId: number, enfantIds: number[]) => {
  const response = await api.post(`/teams/${teamId}/enfants`, {
    enfant_id: enfantIds,
  });
  return response.data.data;
};

export const deleteTeam = async (id: number) => {
  const response = await api.delete(`/teams/${id}`);
  return response.data;
};

export const removeEnfantFromTeam = async (teamId: number, enfantId: number) => {
  const response = await api.post(`/teams/${teamId}/remove-enfant`, {
    enfant_id: enfantId,
  });
  return response.data.data;
};
