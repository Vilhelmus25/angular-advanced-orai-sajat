import { User } from 'src/app/model/user';
import { createReducer, on } from '@ngrx/store';
import { loadItems, errorItem, loadSelectedItem, loadUpdatedItem, loadAddedItem, removeDeletedItem, errorFlush } from './UserActions';
import { Action } from 'rxjs/internal/scheduler/Action';


export interface State {
  [x: string]: any;
  users: { items: User[], selected?: User, error: any };
}

export const initialState: State = {                    // mint az interface paraméterei, üresen.
  users: { items: [], selected: null, error: null }
};

export const UserReducer = createReducer(               // az ngrx/store-ból jön 
  initialState,
  on(loadItems, (state, action) => ({                   // ha megtürténik a liadItems esemény. 
    ...state,                                           // adatok, többet is tertalmazhat, ezért...
    items: action.items                                 // eltárolja items néven az adatokat a state-be
  })),
  on(loadSelectedItem, (state, action) => ({
    ...state,
    selected: action.selected,
  })),
  on(loadUpdatedItem, (state, action) => ({
    ...state,
    items: ((users): User[] => {
      const i = users.items.findIndex((item: User) => item.id === action.item.id);
      const newItems = [...users.items];          // szétspreadelem, mert a store immutable
      newItems[i] = action.item;                  // az adott indexű legyen az action item
      return newItems;
    })(state)                            // IIFE
  })),
  on(loadAddedItem, (state, action) => ({
    ...state,
    items: (state.items as User[]).concat(action.item)
  })),
  on(removeDeletedItem, (state, action) => ({
    ...state,
    items: (state.items as User[]).filter(item => item.id !== action.item.id)     // a megfelelő elem csak akkor maradjon benne, ha nem egyezik a keresett id-vel, vagyis aminek egyezik az id-je, az nem kerül bele a tömbbe, így törlök
  })),
  on(errorItem, (state, action) => ({                     // hiba esetén
    ...state,
    error: action.error
  })),
  on(errorFlush, (state, action) => ({
    ...state,
    error: null                                   // itt ürítjük a store-t
  })),
);

// selectors:
export const selectItems = (state: State) => state.users.items;                       // elérhetővé teszi a Selector a komponensek számára az adatokat
export const selectOneItem = (state: State) => Object.assign({}, state.users.selected);     // a store-ban lévő objektumok inmutable státuszban vannak, vagyis nem tudnmám szerkeszteni az adatokat, így viszont lemásolom és egy másolatát adom vissza
export const selectError = (state: State) => state.users.error?.error;
