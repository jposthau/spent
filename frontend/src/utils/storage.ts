const KEY = 'spentUserId';

export const getUserId = (): number | null => {
  const val = localStorage.getItem(KEY);
  return val ? parseInt(val, 10) : null;
};

export const setUserId = (id: number): void => {
  localStorage.setItem(KEY, String(id));
};

const narrativeKey = (userId: number) => `spentNarrative_${userId}`;

export const getNarrativeCache = (userId: number): string | null =>
  localStorage.getItem(narrativeKey(userId));

export const setNarrativeCache = (userId: number, narrative: string): void =>
  localStorage.setItem(narrativeKey(userId), narrative);

export const clearNarrativeCache = (userId: number): void =>
  localStorage.removeItem(narrativeKey(userId));
