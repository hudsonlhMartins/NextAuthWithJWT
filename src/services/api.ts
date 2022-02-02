import axios, { AxiosError } from "axios";
import {parseCookies, setCookie } from 'nookies'
import { signOut } from "../conext/AuthContext";
import { AuthTokenError } from "./TokenError";

let isRefreshing = false;
let failedRequestsQueue = [];




  export function setupApiClient (ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
      baseURL: 'http://localhost:3333',
      headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
      }
    })

    api.interceptors.response.use(response =>
      response,
      (error: AxiosError) => {
        if (error.response.status === 401) {
          if (error.response.data?.code === "token.expired") {

            cookies = parseCookies(ctx)

            const { 'nextauth.refreshToken': refreshToken } = cookies
            const originalConfig = error.config

            if (!isRefreshing) {

              isRefreshing = true;

              api.post('/refresh', { refreshToken }).then(response => {
                const { token } = response.data

                setCookie(ctx, 'nextauth.token', token, {
                  maxAge: 60 * 60 * 24 * 30, //30 days
                  path: '/' // toda app vai ter acesso a esse token
                })
                setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
                  maxAge: 60 * 60 * 24 * 30, //30 days
                  path: '/'
                })

                api.defaults.headers['Authorization'] = `Bearer ${token}`;

                failedRequestsQueue.forEach(request => request.onSuccess(token))

                failedRequestsQueue = []

              }).catch((error: AxiosError) => {
                failedRequestsQueue.forEach(request => request.onFailure(error))
                failedRequestsQueue = []

                if(process.browser){
                  // retur true ou false
                  // ela return se esta rotando no cliente ou no servidor
                  // true e no browser
                  signOut()
      
                }
              }).finally(() => isRefreshing = false)
            }

            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({
                onSuccess: (token: string) => {
                  originalConfig.headers['Authorization'] = `Bearer ${token}`

                  resolve(api(originalConfig))
                },
                onFailure: (error: AxiosError) => reject(error)
              })
            })
          } else{
            if(process.browser){
              // retur true ou false
              // ela return se esta rotando no cliente ou no servidor
              // true e no browser
              signOut()

            }else{
              return Promise.reject(new AuthTokenError())
            }
          }
        }

        // isso aqui caso não cai esse is o error vai seguir
        return Promise.reject(error)
      })

      return api

  }