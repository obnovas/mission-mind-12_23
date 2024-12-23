import { useSettingsStore } from '../store/settingsStore';

export function getUserData<T>(data: T[], sampleData: T[]): T[] {
  const { settings } = useSettingsStore.getState();
  const { showSampleData, userId } = settings;

  if (!userId) return [];
  
  // Filter data by userId or return sample data if enabled
  const userData = data.filter((item: any) => item.userId === userId);
  return userData.length === 0 && showSampleData ? sampleData : userData;
}

export function createUserItem<T extends { id: string }>(item: Omit<T, 'userId'>): T {
  const { settings } = useSettingsStore.getState();
  return {
    ...item,
    userId: settings.userId,
  } as T;
}