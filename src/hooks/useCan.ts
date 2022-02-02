import { useContext } from "react"
import { validatePermissions } from "../../utils/validatePermissions"
import { AuthContext } from "../conext/AuthContext"

type UseCanParms ={
    permissions?: string[]
    roles?: string[]
}

export function useCan ({permissions, roles}: UseCanParms ){
    const {user, isAuthenticated} = useContext(AuthContext)

    if(!isAuthenticated){
        return false
    }

    const userValidPermissions = validatePermissions({user, permissions, roles})

    return userValidPermissions

}