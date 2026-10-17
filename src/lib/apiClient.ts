import { ofetch } from "ofetch";

// const BASE_URL = "https://ambulance-dispatch-platform.vercel.app/api/v1";
const BASE_URL = "http://localhost:5001/api/v1";

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

export default apiClient;
