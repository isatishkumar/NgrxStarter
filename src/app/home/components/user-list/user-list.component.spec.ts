import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as UserActions from '../../../store/user.actions';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const initialState = {
    user: {
      users: [
        { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', username: 'janedoe', email: 'jane@example.com' }
      ],
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressBarModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [UserListComponent],
      providers: [provideMockStore({ initialState }), FormBuilder]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers action on initialization', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUsers());
  });

  it('should display users in the table', () => {
    fixture.detectChanges();
    component.displayedUser$.subscribe(users => {
      expect(users.length).toBe(2);
    });
  });

  it('should update table state when sorting changes', () => {
    component.sortChange({ active: 'name', direction: 'desc' });
    fixture.detectChanges();
    expect(component.initialSort.sortColumn).toBe('name');
    expect(component.initialSort.sortDirection).toBe('desc');
  });

  it('should filter users based on input', () => {
    component.filterControl.setValue('Jane');
    fixture.detectChanges();

    component.displayedUser$.subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Jane Doe');
    });
  });

  it('should enable editing when startEdit is called', () => {
    component.startEdit(initialState.user.users[0]);
    fixture.detectChanges();
    expect(component.editForm.value.name).toBe('John Doe');
  });

  it('should dispatch updateUser action when saveUser is called', () => {
    component.startEdit(initialState.user.users[0]);
    component.editForm.setValue({ name: 'John Updated', username: 'johndoe', email: 'john@example.com' });
    component.saveUser();
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.updateUser({
      user: { id: 1, name: 'John Updated', username: 'johndoe', email: 'john@example.com' }
    }));
  });

  it('should reset editing state when cancelEdit is called', () => {
    component.startEdit(initialState.user.users[0]);
    component.cancelEdit();
    fixture.detectChanges();
    expect(component.editForm.pristine).toBeTrue();
  });

  it('should update table state on page change', () => {
    component.pageChange({ pageIndex: 1, pageSize: 10, length: 2 } as any);
    fixture.detectChanges();
    expect(component.initialSort.pageIndex).toBe(1);
    expect(component.initialSort.pageSize).toBe(10);
  });
});