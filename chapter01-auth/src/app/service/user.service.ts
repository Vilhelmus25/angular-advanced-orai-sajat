import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  entity = 'users';

  constructor(
    private http: HttpClient,
    private config: ConfigService,

  ) { }

  get(id?: string | number): Observable<User | User[]> {
    let url = `${this.config.apiUrl}${this.entity}`;
    if (id) {
      url += `/${id}`;
    }
    return this.http.get<User[]>(url);
  }

  query(queryString: string): Observable<User | User[]> {
    const url = `${this.config.apiUrl}${this.entity}?${queryString}`;   // ?queryString így kell hazsnálni az url-ben
    return this.http.get<User[]>(url);
  }

  update(user: User): Observable<User> {
    const url = `${this.config.apiUrl}${this.entity}/${user.id}`;   // ?queryString így kell hazsnálni az url-ben
    return this.http.put<User>(url, user);
  }
}
