
import api from "@/utils/api";

// Get all inactive users
export async function getInactiveUsers() {
  const res = await api.get("/users/inactive");
  return res.data;
}

// Activate a user
export async function activateUser(id: number) {
  const res = await api.post(`/users/${id}/activate`);
  return res.data;
}

// Delete a user (refuse)
export async function deleteUser(id: number) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}
