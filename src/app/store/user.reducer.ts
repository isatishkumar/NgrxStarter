import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import  * as UserActions  from "./user.actions";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { User } from "../models/user.model";
import { state } from "@angular/animations";

// export const initialState:UserState ={
//     users:[],
//     loading:false,
//     error:null,
//     selectedUser:null
// }

export interface userState extends EntityState<User>{
    loading:boolean;
    error:string  | null;
}

export const userAdaptor:EntityAdapter<User> = createEntityAdapter<User>();

export const initialState:userState = userAdaptor.getInitialState({
    loading:true,
    error:null
});

export const UserReducer = createReducer(
    initialState,
    on(UserActions.loadUsers,state => ({
        ...state,
        loading:true
    })),
    on(UserActions.loadUserSuccess, (state, {users})=>{
        return ( userAdaptor.setAll(users, {...state,loading:false}))}

),
    on(UserActions.loadUserFailure,(state,{error})=>({
        ...state,
        error,
        loading:false
    })),
    on(UserActions.updateUserSuccess,(state,{user})=>(userAdaptor.updateOne({id:user.id, changes:user},state))),
    on(UserActions.udpateBulkUser,(state,{users})=>(userAdaptor.updateMany(users,state)))

)