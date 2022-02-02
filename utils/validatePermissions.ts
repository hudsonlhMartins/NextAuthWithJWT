type User ={
    permissions: string[]
    roles: string[]
}

type validatePermissionsProps = {
    user: User
    permissions?: string[]
    roles?: string[]
}

export function validatePermissions ({user, permissions, roles}:validatePermissionsProps){

    if(permissions?.length > 0){
        const hasAllPermissions = permissions?.every(permission =>{
            // vai return caso toda contições aqui dentro for satifeita
            return user.permissions.includes(permission)
        })

        if(!hasAllPermissions){
            return false
        }
    }

    if(roles?.length >0){
        const hasAllRoles = roles?.some(role =>{
            // vai return true caso use tive alguns da roles tive
            return user.roles.includes(role)
        })

        if(!hasAllRoles){
            return false
        }
    }

    return true

}