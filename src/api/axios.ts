import axios from 'axios';

const axiosInstance = axios.create();

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 401) {
      //   const retryOriginalRequest = new Promise((resolve) => {
      //     addRefreshSubscriber((accessToken) => {
      //       originalRequest.headers.Authorization = 'Bearer ' + accessToken;
      //       resolve(axios(originalRequest));
      //     });
      //   });
      //   return retryOriginalRequest;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
