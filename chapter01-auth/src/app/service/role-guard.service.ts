import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {   // kap egy mentést az aktivált route-ról
    const expectedRole = route.data.expectedRole;         // ezt ki tudom olvasni

    if (
      !this.auth.currentUserValue ||
      this.auth.currentUserValue.role < expectedRole
    ) {
      this.router.navigate(['forbidden']);                // nem stimmelés esetén ide navigálok
      return false;
    }

    return true;
  }
}
