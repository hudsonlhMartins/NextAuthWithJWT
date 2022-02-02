
import { withSRRAuth } from "../../utils/withSRRAuth"

import { setupApiClient } from "../services/api"
import decode from "jwt-decode"

export default function Metrics  (){



    return(
        <>
            <h1>Metric</h1>
        </>
    )
}

export const getServerSideProps = withSRRAuth(async (ctx)=>{

        const apiClient = setupApiClient(ctx)
        const res = await apiClient.get('/me')
    
    return {
        props:{}
    }
}, {
        permissions: ['metrics.list'],
        roles: ['administrator']
})