import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function withSRRGuest <P>(fn: GetServerSideProps<P>): GetServerSideProps{

    // esse p e um return do srr que estamos usado no caso esta vazio mais __
    // ajuda na tipazem

    // tem que return outra vfunction pq o next no serverSide espera um return de uma function
    return async (ctx:GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> =>{
        let cookies = parseCookies(ctx)

        if(cookies['nextauth.token']){
            return {
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
            }
        }

        return await fn(ctx)
    }
}