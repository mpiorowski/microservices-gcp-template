import { writable } from 'svelte/store';
import type { UserRole } from '../../../@types/users.type';

export const userStore = writable<{
  id: string;
  email: string;
  role: UserRole;
  active: boolean;
} | null>(null);
export const isAuth = writable(false);
export const isReminder = writable(false);
