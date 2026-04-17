export const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

export const hrs = (n: number) => `${n.toFixed(1)}h`;

export const dec = (n: number, places = 1) => n.toFixed(places);
