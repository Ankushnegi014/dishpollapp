const DISHES_URL = "https://raw.githubusercontent.com/syook/react-dishpoll/main/db.json";

export async function fetchDishes() {
  const res = await fetch(DISHES_URL);
  if (!res.ok) throw new Error("Failed to fetch dishes");
  const data = await res.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.dishes)) return data.dishes;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}