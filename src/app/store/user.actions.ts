import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";
import { Update } from "@ngrx/entity";

export const loadUsers = createAction('[User] Load Users');

export const loadUserSuccess = createAction(
        '[User] Load Users Success', 
        props<{users:User[]}>()
        );

export const loadUserFailure = createAction(
    '[User] Load Users Failure',
    props<{error:string}>()
);

export const updateUser = createAction(
    '[User] Update User',
    props<{user:User}>()
)

export const updateUserSuccess = createAction(
    '[User] Update User Success',
    props<{user:User}>()
)

export const updateUserFailure = createAction(
    '[User] Update User Failure',
    props<{error:string}>()
)

export const udpateBulkUser = createAction('[User] Update Bulk',props<{users:Update<User>[]}>())


