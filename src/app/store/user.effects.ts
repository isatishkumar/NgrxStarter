import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../services/user.service";
import * as UserActions from "./user.actions";
import { catchError, exhaustMap, map, mergeMap, of } from "rxjs";

@Injectable()
export class UserEffects {
    loadUser$ = createEffect(() => 
        this.action$.pipe(
            ofType(UserActions.loadUsers),
            exhaustMap(()=> this.userService.getUsers()
            .pipe(
                map(users => UserActions.loadUserSuccess({users})),
                catchError(error=> of(UserActions.loadUserFailure({error:error.message})))
            )
        )
        )
    );

    updateUser$ = createEffect(()=>
    this.action$.pipe(
        ofType(UserActions.updateUser),
        exhaustMap(({user})=> this.userService.updateUser(user)
        .pipe(
            map( updatedUser => UserActions.updateUserSuccess({user:updatedUser})),
            catchError(error=> of(UserActions.updateUserFailure({error:error.message})))
        )
    )
    )
    )
    constructor(private action$:Actions, private userService:UserService){}
}