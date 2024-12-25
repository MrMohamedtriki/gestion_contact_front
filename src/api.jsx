import axios from "axios";

const API_BASE_URL = "http://localhost:3000/contacts";

export const fetchContacts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginated`, {
      params: { page: 1, limit: 100 }, 
    });
    return response.data.data; 
  } catch (error) {
    throw error;
  }
};

export const fetchPaginatedContacts = async (page = 1, limit = 5, nom = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginated`, {
      params: { page, limit, nom },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addContact = async (contact) => {
  try {
    const response = await axios.post(API_BASE_URL, contact);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContact = async (id, contact) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, contact);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    throw error;
  }
};
