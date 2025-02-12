import {  Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, startWith, Subject, takeUntil } from 'rxjs';
import { TableState } from '../../../models/table-state.model';
import { User } from '../../../models/user.model';
import * as UserActions from "../../../store/user.actions";
import { UserState } from '../../../store/user.state';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  displayedColumns:string[] = ['id','name','username','email','actions'];
  filterControl = new FormControl('');
  editForm!:FormGroup;

  private editingUserIdSubject = new BehaviorSubject<number|null>(null);
  editingUserId$ = this.editingUserIdSubject.asObservable();

  private tableStateSubject = new BehaviorSubject<TableState>({
    pageIndex:0,
    pageSize:5,
    sortColumn:'id',
    sortDirection:'asc',
    filterValue:''
  })

  //selectros 
  user$ = this.store.select(state=>state.user.users);
  loading$ = this.store.select(state => state.user.loading);
  error$ = this.store.select(state => state.user.error);

  //Derived stream
  totalUser$ = this.user$.pipe(map(users=>users.length));

  displayedUser$ = combineLatest([
    this.user$,
    this.tableStateSubject,
    this.filterControl.valueChanges.pipe(startWith(''),distinctUntilChanged(),debounceTime(300))]).pipe(
      map(([users, state,filterValue])=>{
       if(!users.length) return [];
        let filtered = this.filterUsers(users, filterValue || '');
        let sorted = this.sortUsers(filtered,state);
        return this.paginateUsers(sorted,state);
      })
    );

   get initialSort():TableState {
    return this.tableStateSubject.value;
   } 

   destory$ = new Subject();
  constructor(private store:Store<{user:UserState}>, private fb:FormBuilder){ }

  ngOnInit(): void {
    this.initForm();
    this.store.dispatch(UserActions.loadUsers());
    this.setupFilterListener()
  }

  ngOnDestroy(): void {
    this.destory$.next(null);
    this.destory$.complete();
  }

  sortChange(sort:Sort){
    this.updateTableState({
      sortColumn:sort.active,
      sortDirection:sort.direction as 'asc' | 'desc'
    })
  }

  startEdit(user:User):void{
    this.editingUserIdSubject.next(user.id);
    this.editForm.patchValue({
      name:user.name,
      username:user.username,
      email:user.email,
    })
  }

  saveUser(): void {
    if (this.editForm.valid) {
      const userId = this.editingUserIdSubject.value;
      const updatedUser: User = {
        id: userId!,
        ...this.editForm.value
      };
      
      this.store.dispatch(UserActions.updateUser({ user: updatedUser }));
      this.editingUserIdSubject.next(null);
      this.editForm.reset();
    }
  }

  cancelEdit(): void {
    this.editingUserIdSubject.next(null);
    this.editForm.reset();
  }

  pageChange(event: PageEvent): void {
    this.updateTableState({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    });
  }

  private initForm():void{
    this.editForm = this.fb.group({
      name:['',Validators.required],
      username: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]]
    });
  }

  private setupFilterListener():void{
    this.filterControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      takeUntil(this.destory$)
    ).subscribe(value=>{
      this.updateTableState({
        filterValue:value||'',
        pageIndex:0
      })
    })
  }

  private filterUsers(users:User[], filterValue:string): User[] {
    const filter = filterValue.toLowerCase();
    return users.filter(user=>
       (''+user.id).toLowerCase().includes(filter) ||
       user.name.toLowerCase().includes(filter) ||
       user.email.toLowerCase().includes(filter) ||
       user.username.toLowerCase().includes(filter)
  );
  }

  private sortUsers(users: User[], state:TableState): User[] {
    if(!state.sortColumn || !state.sortDirection) return users;
    return [...users].sort((a,b)=>{
      const aValue = ( a as any)[state.sortColumn];
      const bValue = ( b as any)[state.sortColumn];
      const direction = state.sortDirection === 'asc' ? 1 : -1;

      if(typeof aValue==='string') {
        return aValue.localeCompare(bValue) * direction;
      }
      return (aValue - bValue) * direction;
    })
  }

  private paginateUsers(users: User[],state:TableState): User[] {
    const startIndex = state.pageIndex * state.pageSize;
    return users.slice(startIndex, startIndex+state.pageSize);
  }

  private updateTableState(partialState:Partial<TableState>):void{
    this.tableStateSubject.next({
      ...this.tableStateSubject.value,
      ...partialState
    });
  }
}

