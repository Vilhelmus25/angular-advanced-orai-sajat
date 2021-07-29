import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = `${this.config.apiUrl}login`;
  logoutUrl = `${this.config.apiUrl}logout`;
  storageName = 'currentUser';
  currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject(null);
  lastToken: string = '';


  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) { }

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginData: User): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(     // küldök a szervernek egy http kérést a szervernek, aki az authentikációt végzi
      this.loginUrl,
      { email: loginData.email, password: loginData.password }      // megkapja az emailt és a passwordot
    )
      .pipe(switchMap(response => {                 // erre kétféle válasz jöhet:
        if (response.accessToken) {                 // vagy kapok accessTokent, ami azt jelenti, hogy sikerült belépnem és kapok egy azonosítót
          this.lastToken = response.accessToken;
          return this.userService.query(`email=${loginData.email}`);  // lekérem az adatokat a userService segítségével     // ez mindig egy tömböt ad vissza
        }
        return of(null);                          // ha nincs accessToken, akkor nullás Observable-el küldöm tovább
      }))
      .pipe(              // megvizsgálom a usert, ha nem létezik, akkor törlöm a storage-ból, ha létezik, akkor a user adatait frissítem és a subjectel elcache-elem a localestorage-ba
        tap(user => {     // tap-el vizsgálom az user-t nem módosítja.
          if (!user) {
            localStorage.removeItem(this.storageName);    // kivesszük a localestorage-ből, ha benne lett volna
            this.currentUserSubject.next(null);         // tovább nextelem a null-t mert nem sikerült belépni
          } else {
            user[0].token = this.lastToken;             // a user egy tömb lesz és az első eleme lesz maga a felhasználó, akivel dolgozni szeretnék
            localStorage.setItem(this.storageName, JSON.stringify(user[0]));
            this.currentUserSubject.next(user[0]);      // minden feliratkozónak szólok, hogy megjött a felhasználói adat
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.storageName);
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }
}
