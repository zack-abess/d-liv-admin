import axios from "axios";
import { useAuthedUser } from "~/stores/authedUser";
import appConfig from "~/app.config.ts";

const createAxiosClient = (baseURL) => {
  const axiosClient = axios.create({
    baseURL,
  });

  return axiosClient;
};

const createAxiosClient2 = (baseURL) => {
  const axiosClient = axios.create({
    baseURL,
  });

  axiosClient.interceptors.request.use((config) => {
    const authedUser = useAuthedUser();

    //get token
    const token = authedUser.authData.token;
    
    if (token) {
      config.headers.authentication = token;
    }
    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 401 → on tente un refresh une seule fois, puis on rejoue la requête
      if (
        error.response &&
        error.response.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const authedUser = useAuthedUser();
        const newToken = await authedUser.refreshToken();

        if (newToken) {
          originalRequest.headers.authentication = newToken;
          return axiosClient(originalRequest);
        }
      }

      // Toute autre erreur (ou refresh échoué) est propagée correctement
      return Promise.reject(error);
    },
  );

  return axiosClient;
};

// instances with different base URLs
const axiosClient = createAxiosClient(appConfig.api.auth);
const axiosClient2 = createAxiosClient2(appConfig.api.auth);
const axiosClient3 = createAxiosClient2(appConfig.api.base);
export { axiosClient, axiosClient2, axiosClient3 };