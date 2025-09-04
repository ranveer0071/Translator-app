import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // use ngrok URL if testing on phone
  withCredentials: false,
});

export default instance;
