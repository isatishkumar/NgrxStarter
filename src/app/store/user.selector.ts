import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userAdaptor, userState } from "./user.reducer";

export const fearuteSelector = createFeatureSelector<userState>('user');
export const {selectAll:selectAllusers,selectTotal:selectTotalUsers} = userAdaptor.getSelectors(fearuteSelector);

export const selectLoading = createSelector(fearuteSelector,(state)=>state.loading);
export const selectError = createSelector(fearuteSelector,(state)=>state.loading);