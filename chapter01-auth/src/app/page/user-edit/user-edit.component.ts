import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user: User = null;
  serverError = '';

  constructor(
    private userService: UserService,
    private ar: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.ar.params.pipe(    // a params egy observable-t ad vissza és tovább pájpolom
      switchMap(params => this.userService.get(params.id))    // egy másik observable-t ad vissza és lekérem az illetőt id alapján
    )
      .pipe(take(1))      // tovább pipe-olom; take(1) => az első válaszig megy
      .subscribe(         // feliratkozom
        user => {         // visszakapom a usert és a jelszót, amit üresre állítok
          this.user = (user as User);
          this.user.password = '';
        }
      );
  }

  onSubmit(ngForm: NgForm): void {      // amikor elküldjük az adatokat
    const putObject = Object.assign({ id: this.user.id }, ngForm.value);      // az id-t nem teszem ki az űrlapba, nehogy átírják, ezért most az id-t bele kell vennem és összefűzni a Userrel(ngForm.value)
    this.userService.update(putObject)
      .toPromise().then(                // mert az update egy Observable
        user => history.back(),         // visszalépek a listára
        err => {
          this.serverError = err.error;
          const to = setTimeout(() => {
            clearTimeout(to);
            this.serverError = '';        // 3 sec-ig látjuk a hibát
          }, 3000);
        }
      );
  }

}
