import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { ConfigService } from 'src/app/service/config.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  list$: Observable<any> = this.userService.get();
  cols: any[] = this.config.userColumns;        // központilag állítható a táblázat oszlopnevei

  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
  }

  update(user: User): void {
    this.userService.update(user).toPromise().then(
      userResponse => console.log(userResponse),        // ha visszajött a válasz a servertől, akkor kilogolom
      err => console.error(err)
    );
  }

}
