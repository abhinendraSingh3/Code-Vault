import api from './axios';
import type { UserProfileData } from '../types/auth.types';

// Fetch profile data for a specific user ID
export const getUserProfile = async (userId: string | number) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
};

// Update profile data for a specific user ID
export const updateUserProfile = async (
    userId: string | number,
    data: Partial<UserProfileData>
) => {
    const response = await api.put(`/users/profile/${userId}`, data);
    return response.data;
};

// Reset password for user
export const resetPasswordApi = async (
    userId: string | number,
    data: { currentPassword: string; newPassword: string }
) => {
    const response = await api.put(`/users/reset-password/${userId}`, data);
    return response.data;
};
