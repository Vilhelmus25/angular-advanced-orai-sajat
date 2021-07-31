import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { UserService } from 'src/app/service/user.service';
import { loadItems, getItems, getOneItem, LOAD_ITEMS, ERROR_ITEM, LOAD_SELECTED_ITEM, updateItem, LOAD_UPDATED_ITEM, addItem, LOAD_ADDED_ITEM, deleteItem, REMOVE_ITEM } from './UserActions';
import { switchMap, catchError, tap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';


@Injectable()                 // Decorator, hogy tudja bele injektálni dolgokat
export class UserEffect {                                     // kapcsolatot teremt a service(Service) és az esemény(Action) között, vagyis az Effect
  loadItems$ = createEffect((): Observable<Action> => {       // kapott egy $-t mert Observable-t ad vissza
    return this.actions$.pipe(
      ofType(getItems),                                       // az actionök közül melyiknél fusson le a pipe, ha ez a getItems action volt, akkor:
      switchMap(() => this.userService.get()),                // lekéri az összes user-t
      switchMap(users => of({ type: LOAD_ITEMS, items: users })),    // itt már vannak usereim, az of azonnal létrehoz egy observable-t, és kiváltom a LOAD_ITEMS eseményt
      catchError(error => of({ type: ERROR_ITEM, error })),         // ha hiba van, akkor ERROR_ITEM eseményt váltok ki, triggerelek
    );
  });

  getOneItem$ = createEffect((): Observable<Action> => {
    return this.actions$.pipe(
      ofType(getOneItem),
      withLatestFrom(this.store$),
      switchMap(([action, store]) => {
        const cache = store.users?.items?.find(item => item.id === action.id);
        return cache ? of(cache) : this.userService.get(action.id);
      }),
      switchMap(user => of({ type: LOAD_SELECTED_ITEM, selected: user })),
      catchError(error => of({ type: ERROR_ITEM, error })),
    );
  });

  updateItem$ = createEffect((): Observable<Action> => {
    return this.actions$.pipe(
      ofType(updateItem),
      switchMap(action => this.userService.update(action.item)),
      switchMap(user => of({ type: LOAD_UPDATED_ITEM, item: user })),
      catchError(error => of({ type: ERROR_ITEM, error })),
    );
  });

  addItem$ = createEffect((): Observable<Action> => {
    let lastAcion = null;
    return this.actions$.pipe(
      ofType(addItem),
      tap(action => lastAcion = action),
      mergeMap(action => this.userService.create(action.item).pipe(
        switchMap(() => this.userService.query(`email=${lastAcion.item.email}`)),
        switchMap(user => of({ type: LOAD_ADDED_ITEM, item: user })),
        catchError(error => of({ type: ERROR_ITEM, error })),
      )),
    );
  });

  deleteItem$ = createEffect((): Observable<Action> => {
    let lastAcion = null;
    return this.actions$.pipe(
      ofType(deleteItem),
      tap(action => lastAcion = action),
      switchMap(action => this.userService.delete(action.item)),
      switchMap(user => of({ type: REMOVE_ITEM, item: lastAcion.item })),
      catchError(error => of({ type: ERROR_ITEM, error })),
    );
  });

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store$: Store<any>,
  ) { }

}
