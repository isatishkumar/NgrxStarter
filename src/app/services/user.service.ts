import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl= 'https://jsonplaceholder.typicode.com/users';

  constructor(private http:HttpClient) { }
  /**
   * 
   * @returns users
   */
  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  updateUser(user:User):Observable<User>{
    return this.http.put<User>(`${this.apiUrl}/${user.id}`,user);
  }
}
