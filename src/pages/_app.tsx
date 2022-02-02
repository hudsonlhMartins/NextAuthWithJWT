import type { AppProps } from 'next/app'
import { AuthProvider } from '../conext/AuthContext'

function MyApp({ Component, pageProps }: AppProps) {
  return( 
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
      )
}

export default MyApp
