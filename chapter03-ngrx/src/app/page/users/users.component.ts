import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { ConfigService } from 'src/app/service/config.service';
import { User } from 'src/app/model/user';
import { Store, select } from '@ngrx/store';
import { getItems, addItem, deleteItem, errorFlush } from 'src/app/store/user/UserActions';
import { selectItems, selectError } from 'src/app/store/user/UserReducers';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // list$: Observable<User | User[]> = this.userService.get();
  list$: Observable<User | User[]>;
  cols: any[] = this.config.userColumns;
  error$ = this.store.pipe(select(selectError)).pipe(
    tap(error => {
      const to = setTimeout(() => {
        clearTimeout(to);
        this.store.dispatch(errorFlush());
      }, 3000);
    })
  );

  constructor(
    private userService: UserService,
    private config: ConfigService,
    private store: Store<any>,                    // a Store-ban vannak az adatok
  ) { }

  ngOnInit(): void {                              // kezdésre, ngOnInit
    this.store.dispatch(getItems());              //  az eseményt el kell indítani, egy Action kell, ami a getItems(). lsd.: UserActions.ts
    this.list$ = this.store.pipe(select(selectItems));  // a Store-t tovább pipe-olom és ide kell rakni a select nevű fv-t, ami szintén ngrx/store cucc.
    // a selectItems, a User.Reducers.ts-ben van a selector a végén!
  }

  update(user: User): void {
    this.userService.update(user).toPromise().then(
      userResponse => console.log(userResponse),
      err => console.error(err)
    );
  }

  delete(user: User): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.store.dispatch(deleteItem({ item: user }));
  }

  create(): void {
    const user = new User();              // ezeket megköveteli a JSON server, hogy ne dobja el hibával
    user.first_name = 'New';
    user.last_name = 'User';
    user.email = 'test@test.org';
    user.password = 'test';
    this.store.dispatch(addItem({ item: user }));
  }

}
