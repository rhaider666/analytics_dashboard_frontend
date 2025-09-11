// src/lib/api.js
import axios from "axios";

const API_URL = "http://localhost:5000"; // change if needed (e.g., deployed URL)

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to headers if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
       config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic wrapper for requests
export async function apiRequest(method, url, data = {}, config = {}) {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });

    return response.data; // only return data, not full response
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "API Request Failed");
  }
}

// ============================
// Specific API Endpoints
// ============================

// Users
export const addUser = (userData) => apiRequest("post", "/addUser", userData);
export const getUsers = () => apiRequest("get", "/getUser");
export const selectUser = (payload) =>
  apiRequest("post", "/selectUser", payload);

// Posts
export const createPost = (postData) =>
  apiRequest("post", "/createPost", postData);

export const addComment = (commentData) =>
  apiRequest("post", "/addComment", commentData);

export const getPosts = (query) => {
  const queryStr = encodeURIComponent(JSON.stringify(query));
  return apiRequest("get", `/getPosts/${queryStr}`);
};

// Analytics
export const getTopAuthors = () => apiRequest("get", "/topAuthors");
export const getMostCommentedPosts = () =>
  apiRequest("get", "/mostCommentedPosts");
export const getPostsPerDay = () => apiRequest("get", "/postsPerDay");


