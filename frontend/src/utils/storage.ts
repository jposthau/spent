const KEY = 'spentUserId';

export const getUserId = (): number | null => {
  const val = localStorage.getItem(KEY);
  return val ? parseInt(val, 10) : null;
};

export const setUserId = (id: number): void => {
  localStorage.setItem(KEY, String(id));
};
