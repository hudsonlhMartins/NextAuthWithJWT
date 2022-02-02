import Router from "next/router"
import { createContext, ReactNode, useEffect, useState } from "react"

import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from "../services/ApiClient"

interface AuthProviderProps{
    children: ReactNode
    // reactNode e quando o component pode receber qualquer coisa__
    // component number, string etc.. 
}

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignCredentils = {
    email: string;
    password: string;
   
}

type AuthContextData = {
    signIn(credentils: SignCredentils): Promise<void>;
    signOut: ()=> void
    user: User
    isAuthenticated: boolean;
}
  
  type SignInCredentials = {
    email: string;
    password: string
  }
    
  
  export const AuthContext = createContext({} as AuthContextData)
  

  export function signOut (){
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    authChannel.postMessage('signOut')

    Router.push('/')
  }

  let authChannel: BroadcastChannel

  export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>(null)
    const isAuthenticated = !!user
  
    useEffect(()=>{
      authChannel = new BroadcastChannel('auth')

      authChannel.onmessage = (msg) =>{
        switch (msg.data){
          case 'signOut':
              signOut()
            break
          default:
            break
        }
      }
    },[])

    useEffect(() => {
      const { 'nextauth.token': token } = parseCookies();
      if (token) {
        api.get('/me')
          .then(response => {
            const { email, permissions, roles } = response.data;
            setUser({ email, permissions, roles })
  
          }).catch(() =>{
            signOut()

          })
      }
    }, [])
  
  
  
    async function signIn({ email, password }: SignInCredentials) {
  
      try {
        const response = await api.post('/sessions', { email, password })
  
        const { token, refreshToken, permissions, roles } = response.data
  
        setCookie(undefined, 'nextauth.token', token, {
          maxAge: 60 * 60 * 24 * 30, //30 days
          path: '/'
        })
        setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
          maxAge: 60 * 60 * 24 * 30, //30 days
          path: '/'
        })
  
        setUser({
          email,
          permissions,
          roles
        })
  
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        // atulizar o token
        
        Router.push("/dashboard")
      } catch (error) {
        console.warn(error)
      }
  
    }
  
    return (
      <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
        {children}
      </AuthContext.Provider>
    )
  }