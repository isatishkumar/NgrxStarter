import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import  * as UserActions  from "./user.actions";

export const initialState:UserState ={
    users:[],
    loading:false,
    error:null,
    selectedUser:null
}

export const UserReducer = createReducer(
    initialState,
    on(UserActions.loadUsers,state => ({
        ...state,
        loading:true
    })),
    on(UserActions.loadUserSuccess, (state, {users})=>({
        ...state,
        loading:false,
        users,
        error:null
    })),
    on(UserActions.loadUserFailure,(state,{error})=>({
        ...state,
        error,
        loading:false
    })),
    on(UserActions.updateUserSuccess,(state,{user})=>({
        ...state,
        users:state.users.map(u=> u.id === user.id ? user : u),
        error:null
    }))
)