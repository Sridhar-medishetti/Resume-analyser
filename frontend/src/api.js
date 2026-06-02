import axios from "axios";

const API = axios.create({
  baseURL: "https://resume-analyser-zm57.onrender.com",
});

export default API;