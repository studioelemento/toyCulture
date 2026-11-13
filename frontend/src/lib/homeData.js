import { mapHomeServiceProduct } from './storefrontProducts';

export async function fetchHomeBundle() {
  const res = await fetch('/api/home');
  if (!res.ok) throw new Error('Failed to load home data');
  const json = await res.json();
  const payload = json?.data || {};
  return {
    newArrivals: (payload.new_arrivals || []).map(mapHomeServiceProduct).filter(Boolean),
    topSelling: (payload.top_selling || []).map(mapHomeServiceProduct).filter(Boolean),
  };
}
