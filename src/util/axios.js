import axios from "axios";
import { TokenService } from "../saga/token";

export const axiosApiInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //쿠키값 공유(refresh_token, access_token(jwt))
});
//인증 토큰이 만료되면 실패
//실패를 캐치해서 다시 refresh토큰으로 인증토큰 재발급 요청을 보내고 재발급된 인증토큰으로 retry 하는 로직

/*
const originalRequest = error.config; 
if (error.response.status --- 401 && !originalRequest._retry) {
  originalRequest._retry = true; 
}
*/

axiosApiInstance.interceptors.request.use(
  async (config) => {
    const access_token = TokenService.get(process.env.REACT_APP_TOKEN_KEY);
    if (!access_token) {
      return config;
    } else {
      config.headers = {
        Authorization: `Bearer ${access_token}`, //jws 인증 토큰 보내는 로직,
      };
    }
  },
  (error) => {
    throw new Error(error);
  }
);
