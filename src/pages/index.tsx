import type { GetServerSideProps, NextPage } from 'next'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../conext/AuthContext'
import {parseCookies} from 'nookies'
import { redirect } from 'next/dist/server/api-utils'
import { withSRRGuest } from '../../utils/withSRRGuest'

const Home: NextPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {signIn} =  useContext(AuthContext)

  const handleSubmit = async (e: FormEvent)=>{
    e.preventDefault()

    const data = {
      email,
      password
    }

    await signIn(data)
  }


  return (
    <form onSubmit={handleSubmit}>
      <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
      <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

      <button type='submit'>Entrar</button>
    </form>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps = withSRRGuest (async (ctx)=>{

  return{
    props:{}
  }
})