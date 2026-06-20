import api from "./axios";

export const getOrders = async (page = 1, limit = 10) => {
  const response = await api.get(`/orders?page=${page}&limit=${limit}`);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data;
};