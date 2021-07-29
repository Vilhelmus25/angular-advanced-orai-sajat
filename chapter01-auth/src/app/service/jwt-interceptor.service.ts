import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {   // implementálom ezt az interface-t

  constructor(
    private auth: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // User data cannot be accessed without a token.
    // Ezen a módon ugyanis a felhasználók adatait meg tudja bárki tekinteni bejelentkezés nélkül is. Azonban, ha az intercept függvény átírjuk így, csak a token birtokában érhetőek el a user-ök adatai:
    const currentToken = this.auth.lastToken;

    if (currentToken) {
      request = request.clone({   // klónozni kell a http kérést, azt nem szabad megváltoztatni
        setHeaders: {
          Authorization: `Bearer ${currentToken}`
        }
      });
    }

    return next.handle(request);    // ha nincs token, akkor azt küldöm vissza amit kértem, ha van, akkor leklónozom, felülírom a klónozottal és a fejlécébe kiegészítem az Authorization sorral és átadom neki a tokent, amit tároltam
  }
}
