import axios from "axios";
import { environment } from "./config/environment";
// Add a request interceptor
export const useInterceptor = () => {
    axios.interceptors.request.use(
        async function (config) {
            // Do something before request is sent
            let token = localStorage.getItem("ACCESS_TOKEN");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) =>
            // Do something with request error
            Promise.reject(error)
    );

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async function (error) {
            const refreshToken = localStorage.getItem("REFRESH_TOKEN");
            if (
                error.response.status === 401 &&
                error.response.data === "Unauthorized" &&
                refreshToken
            ) {
                try {
                    const res = await axios.post(
                        `${environment.host}/users/refresh-token`,
                        {
                            refreshToken,
                        }
                    );
                    const token = res.data.token;
                    localStorage.setItem("ACCESS_TOKEN", token);
                } catch (e) {
                    alert(e.message + " Please login again");
                    localStorage.clear();
                    window.location.reload();
                }
                return axios(error.config);
            }
            return Promise.reject(error);
        }
    );
};
