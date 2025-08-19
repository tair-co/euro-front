import axios from "axios";

const axiosApi = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "X-API-TOKEN": localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "",
  },
});

export const apiGet = async (path) => {
  try {
    const response = await axiosApi.get(path);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const apiPost = async (path, data) => {
  try {
    const response = await axiosApi.post(path, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
