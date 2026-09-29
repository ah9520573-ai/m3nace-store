import axios from 'axios';
export const API_URL=import.meta.env.VITE_API_URL||'/api';
const client=axios.create({baseURL:API_URL,withCredentials:true}); client.interceptors.request.use(config=>{const token=localStorage.getItem('m3nace_token'); if(token)config.headers.Authorization=`Bearer ${token}`; return config;}); export default client;
