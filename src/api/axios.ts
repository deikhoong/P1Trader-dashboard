import axios, { AxiosInstance, isCancel} from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const atToken = localStorage.getItem('at');
    if (atToken) {
      config.headers['Authorization'] = `Bearer ${atToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) =>  {
    const originalRequest = error.config
    if ( !isCancel(error) && error.response?.status === 401 &&  !originalRequest._retry ) {
      const refreshToken = localStorage.getItem('rt'); 
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/auth/refresh-token`, {},{
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
          )

          if (response && response.data) {
            const { access_token } = response.data.data;
            localStorage.setItem('at', access_token);
            return axiosInstance(originalRequest);
          }
        } catch (err) {
          console.error('Token refresh failed:', err);
        }
    }
  }
  return Promise.reject(error);
});

export default axiosInstance;



