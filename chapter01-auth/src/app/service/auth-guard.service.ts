import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {    // interface: az angular routerből jön

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  canActivate(): boolean {                // az interface követeli
    if (!this.auth.currentUserValue) {    // null lesz, ha nincs user
      this.router.navigate(['login']);    // ezért megyek a login oldalra
      return false;
    }
    return true;                          // ennyi a guard, ez védi meg oldalakat ahol beállítom az app.routing.module-ban
  }
}
