const USER_URL = "https://raw.githubusercontent.com/syook/react-dishpoll/main/users.json"

export async function fetchUsers() {
  const res = await fetch(USER_URL);
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.dishes)) return data.users;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}