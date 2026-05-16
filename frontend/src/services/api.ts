import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs
export const loginAPI = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  }
  return res;
};

export const logoutAPI = () => {
  localStorage.removeItem("token");
  delete API.defaults.headers.common["Authorization"];
  return API.post("/auth/logout");
};

export const getMeAPI = () => {
  const token = localStorage.getItem("token");
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return API.get("/auth/me");
};

// Blog APIs
export const getBlogsAPI = (params?: string) => API.get(`/blogs${params ? `?${params}` : ""}`);
export const getBlogBySlugAPI = (slug: string) => API.get(`/blogs/${slug}`);
export const createBlogAPI = (data: any) => API.post("/blogs", data);
export const updateBlogAPI = (id: string, data: any) => API.put(`/blogs/update/${id}`, data);
export const deleteBlogAPI = (id: string) => API.delete(`/blogs/delete/${id}`);

// Job APIs
export const getJobsAPI = (params?: string) => API.get(`/jobs${params ? `?${params}` : ""}`);
export const getJobAPI = (id: string) => API.get(`/jobs/${id}`);
export const createJobAPI = (data: any) => API.post("/jobs", data);
export const updateJobAPI = (id: string, data: any) => API.put(`/jobs/${id}`, data);
export const deleteJobAPI = (id: string) => API.delete(`/jobs/${id}`);

// College APIs
export const getCollegesAPI = (params?: string) => API.get(`/colleges${params ? `?${params}` : ""}`);
export const getCollegeBySlugAPI = (slug: string) => API.get(`/colleges/slug/${slug}`);
export const getCollegeAPI = (id: string) => API.get(`/colleges/${id}`);
export const createCollegeAPI = (data: any) => API.post("/colleges", data);
export const updateCollegeAPI = (id: string, data: any) => API.put(`/colleges/${id}`, data);
export const deleteCollegeAPI = (id: string) => API.delete(`/colleges/${id}`);

// Program APIs
export const getProgramsAPI = (params?: string) => API.get(`/programs${params ? `?${params}` : ""}`);
export const getProgramAPI = (id: string) => API.get(`/programs/${id}`);
export const createProgramAPI = (data: any) => API.post("/programs", data);
export const updateProgramAPI = (id: string, data: any) => API.put(`/programs/${id}`, data);
export const deleteProgramAPI = (id: string) => API.delete(`/programs/${id}`);

// Inquiry APIs
export const submitInquiryAPI = (data: any) => API.post("/inquiry", data);
export const getInquiriesAPI = (params?: string) => API.get(`/inquiry${params ? `?${params}` : ""}`);
export const deleteInquiryAPI = (id: string) => API.delete(`/inquiry/${id}`);

// Partner APIs
export const submitCollegePartnerAPI = (data: any) => API.post("/partners/college", data);
export const getCollegePartnersAPI = () => API.get("/partners/college");
export const deleteCollegePartnerAPI = (id: string) => API.delete(`/partners/college/${id}`);

export const submitConsultantPartnerAPI = (data: any) => API.post("/partners/consultant", data);
export const getConsultantPartnersAPI = () => API.get("/partners/consultant");
export const deleteConsultantPartnerAPI = (id: string) => API.delete(`/partners/consultant/${id}`);

// Testimonial APIs
export const getTestimonialsAPI = () => API.get("/testimonials");
export const createTestimonialAPI = (data: any) => API.post("/testimonials", data);
export const deleteTestimonialAPI = (id: string) => API.delete(`/testimonials/${id}`);

// Stats API
export const getStatsAPI = () => API.get("/stats");

export default API;
