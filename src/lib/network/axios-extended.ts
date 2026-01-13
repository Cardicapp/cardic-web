import axios, { AxiosRequestConfig } from 'axios'
import { endsWithAny } from '..'
import { store } from '../../store/store'
import createAuthRefreshInterceptor from './refreshAuth'
import { deleteCookie } from 'cookies-next'
import { setAuthState } from '@/store/authSlice'

const baseURL = process.env.NEXT_PUBLIC_API_URL
console.log("BASE URL +=======>", baseURL)
const axiosExtended = axios.create({
  baseURL,
})

const authNotRequiredURLs = [
  '/register',
  '/login',
]

axiosExtended.interceptors.request.use((config) => {
  if (!getExcludedURLs(config)) {
    const { auth } = store.getState()
    const {
      token,
    } = auth
    // @ts-ignore
    if (!config.headers) config.headers = {}
    config.headers.Authorization = `Bearer ${token}`
    return config
  }
  return config
})

const getExcludedURLs = (config: AxiosRequestConfig) => config.url && endsWithAny(config.url, authNotRequiredURLs)

axiosExtended.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    // if (
    //   error.response &&
    //   error.response.status === 401 &&
    //   !originalRequest._retry
    // ) {
    //   // originalRequest._retry = true;
    //   // const newAccessToken = await refreshToken();
    //   // store.dispatch({
    //   //   type: ACTION_TYPES.LOGIN_SUCCESS,
    //   //   payload: newAccessToken.Data,
    //   // });
    //   // originalRequest.headers.Authorization = `Bearer ${newAccessToken.Data.AccessToken}`;
    //   // return axios(originalRequest);
    // } else 
    if (error.response && error.response.status === 401) {
      deleteCookie('auth')
      location.assign(`/admin/login`)
    } else {
      return Promise.reject(error);
    }
  },
);

const refreshToken = () => new Promise((resolve, reject) => {
  const { auth } = store.getState()
  const {
    token,
    // @ts-ignore
    refreshToken,
  } = auth
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `bearer ${token}`)
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    refreshToken,
    GrantType: 'REFRESH_TOKEN',
  })

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  fetch(`${baseURL}/api/v1/Login`, requestOptions)
    .then((response) => response.json())
    .then((newAccessToken) => {
      setAuthState({
        ...auth,
        token: newAccessToken,
      })
    })
    .then((result) => resolve(result))
    .catch((error) => reject(error))
})

createAuthRefreshInterceptor(axiosExtended, refreshToken)

export default axiosExtended
