import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  serverError = '';

  constructor(
    private auth: AuthService,
    private router: Router,   // a sikeres bejelntkezés után szeretnénk a usert átnavigálni
  ) { }

  ngOnInit(): void {
  }

  onLogin(ngForm: NgForm): void {
    this.auth.login(ngForm.value).toPromise().then(     // átadom az ngForm pillanatnyi értékét, visszabutítom promisseá
      userResponse => {           // ha sikerül belépnem, akkor kapok egy válaszüzenetet
        if (this.auth.currentUserValue) {   // ha van értéke, nem null
          this.router.navigate(['/']);      // akkor a főoldalra navigál
        }
      },
      err => {                          // különben
        this.serverError = err.error;
        const to = setTimeout(() => {   // 3 sec-ig fog a hibaüzenet megjelenni
          clearTimeout(to);
          this.serverError = '';
        }, 3000);
      }
    );
  }

}
