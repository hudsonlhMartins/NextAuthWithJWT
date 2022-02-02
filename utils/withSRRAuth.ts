import jwtDecode from "jwt-decode";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../src/services/TokenError";
import { validatePermissions } from "./validatePermissions";

type WithSRRAuthOptions ={
    permissions?: string[]
    roles?: string[]
}


export function withSRRAuth <P>(fn: GetServerSideProps<P>, options?: WithSRRAuthOptions): GetServerSideProps{

    // esse p e um return do srr que estamos usado no caso esta vazio mais __
    // ajuda na tipazem

    // tem que return outra vfunction pq o next no serverSide espera um return de uma function
    return async (ctx:GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> =>{
        let cookies = parseCookies(ctx)
        const token = cookies['nextauth.token']

        if(!token){
            return {
                redirect:{
                    destination: '/',
                    permanent: false
                }
            }
        }

        if(options){
            const user = jwtDecode<{permissions: string[], roles: string[]}>(token)
            const {permissions, roles} = options

            const  userHasValidPermissions = validatePermissions({
                user,
                permissions,
                roles
            })

            if(!userHasValidPermissions){
                return{
                    redirect:{
                        destination: '/dashboard',
                        permanent: false
                    }
                }
            }
        }


        try{
            return await fn(ctx)

        }catch(err){
           if(err instanceof AuthTokenError){
              // console.log(err instanceof AuthTokenError)
                destroyCookie(ctx, 'nextauth.token')
                destroyCookie(ctx, 'nextauth.refreshToken')
        
                return {
                    redirect:{
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}