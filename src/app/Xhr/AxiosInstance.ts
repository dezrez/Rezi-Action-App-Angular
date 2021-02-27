/*DONT CHANGE THIS FILE*/
import Axios, * as axio from "axios";

export class ReziAxios {
    baseApi: string;
    authEndpoint: string;
    token: string;
    refresh: string;
    constructor(baseApi: string, token: string, refresh: string) {
        this.baseApi = baseApi;
        this.token = token;
        this.refresh = refresh;
        if (baseApi.indexOf("https://api.dezrez.com") >= 0) {
            this.authEndpoint = "https://auth.dezrez.com/Dezrez.Core.Api/oauth/token";
        } else if (baseApi.indexOf("uat") >= 0) {
            this.authEndpoint = "https://dezrez-core-auth-uat.dezrez.com/Dezrez.Core.Api/oauth/token";
        } else {
            this.authEndpoint = "https://dezrez-core-auth-systest.dezrez.com/Dezrez.Core.Api/oauth/token";
        }
    }

    public getInstance = (): axio.AxiosInstance => {
        const self: ReziAxios = this;
        const config = {
            baseURL: this.baseApi,
            headers: { "Content-Type": "application/json", "Rezi-Api-Version": "1.0" }
        };



        const inst = Axios.create(config);

        inst.interceptors.request.use(
            config => {

                if (this.token) {
                    config.headers['Authorization'] = 'Bearer ' + self.token;
                }
                // config.headers['Content-Type'] = 'application/json';
                return config;
            },
            error => {
                Promise.reject(error.response)
            });

        inst.interceptors.response.use((response) => {
            return response
        }, function (error) {
            const originalRequest = error.config;
            if (error.response) {
                if (error.response.status === 401 && originalRequest.url === self.authEndpoint) {
                    return Promise.reject(error.response);
                }

                // in the case of the app proxy endpoint, it can return a legitimate 401, so send it back
                if (error.response.status === 401 && originalRequest.url.indexOf("app/endpoint") >= 0) {
                    return Promise.reject(error.response);
                }


                if (error.response.status === 401 && !originalRequest._retry) {

                    originalRequest._retry = true;
                    return Axios.post(self.authEndpoint, { grant_type: "refresh_token", refresh_token: self.refresh }, { headers: { "Content-Type": "application/json", "Authorization": `Basic ${btoa("Rezi SPA:cheesebiscuits")}` } })
                        .then(res => {

                            if (res.status === 200) {
                                self.token = res.data.access_token;
                                inst.defaults.headers.common["Authorization"] = `Bearer ${self.token}`;
                                return Axios.create(originalRequest);
                            }
                        })
                }
            }
            return Promise.reject(error.response);
        });

        return inst;

    };

}



