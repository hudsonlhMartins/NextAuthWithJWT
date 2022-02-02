import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanParmas {
    children: ReactNode;
    permissions?: string[];
    roles?: string[]; 

}


export function Can({children, permissions, roles}:CanParmas){

    const useCanSeeComponent = useCan({permissions, roles})

    if(!useCanSeeComponent){
        return null
    }


    return(
        <>
            {children}
        </>
    )
}