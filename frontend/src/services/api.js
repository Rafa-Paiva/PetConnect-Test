const BASE_URL = "https://pet-connect-ax1f.onrender.com";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  register: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },
  getPets: async (token) => {
    const res = await fetch(`${BASE_URL}/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
