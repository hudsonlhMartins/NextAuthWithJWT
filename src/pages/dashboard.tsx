import { redirect } from "next/dist/server/api-utils"
import { destroyCookie } from "nookies"
import { useContext, useEffect } from "react"
import { withSRRAuth } from "../../utils/withSRRAuth"
import { Can } from "../components/Can"
import { AuthContext } from "../conext/AuthContext"
import { useCan } from "../hooks/useCan"
import { setupApiClient } from "../services/api"
import { api } from "../services/ApiClient"


export default function Dashboard  (){

    const {user, signOut} = useContext(AuthContext)

    const userCanMetrics = useCan({
        permissions: ['metrics.list']
    })

    useEffect(()=>{
        // token e o novo nome desse nextauth.token

            api.get('me').then(res =>{
              console.log(res)
            }).catch(err => console.log(err))
        
    },[])

    return(
        <>
            <h1>Ola mundo dashboard. teu e email e {user?.email}</h1>
            
            <Can permissions={['metrics.list']}>
                <div>Metricas</div>
            </Can>

            <button onClick={signOut}>SignOut</button>
        </>
    )
}

export const getServerSideProps = withSRRAuth(async (ctx)=>{

        const apiClient = setupApiClient(ctx)
        const res = await apiClient.get('/me')
    
        console.log(res)

    return {
        props:{}
    }
})