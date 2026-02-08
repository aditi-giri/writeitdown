import axios from "axios";

const authApi = axios.create({
  baseURL: "https://writeitdown-1.onrender.com"
});

export default authApi;
