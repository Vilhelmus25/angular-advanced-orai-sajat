import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/model/user';

// Constant names for actions.
export const GET_ITEMS = '[User] get items';      // az entitás neve: [User] ; és az esemény: 'get items'
export const GET_ONE_ITEM = '[User] get item';
export const LOAD_ITEMS = '[User] load items';
export const LOAD_SELECTED_ITEM = '[User] load selected';
export const UPDATE_ITEM = '[User] update item';
export const LOAD_UPDATED_ITEM = '[User] load updated';
export const ADD_ITEM = '[User] add item';
export const LOAD_ADDED_ITEM = '[User] load added';
export const DELETE_ITEM = '[User] delete item';                      // elküldi a törlést a szervernek
export const REMOVE_ITEM = '[User] remove added';                     // a store-ból távolítja el

export const ERROR_ITEM = '[User] error item';
export const FLUSH_ERROR = '[User] error flush';


// Actions.
export const getItems = createAction(GET_ITEMS);
export const getOneItem = createAction(
  GET_ONE_ITEM,
  props<{ id: string | number }>()        // properties, milyen paraméterekkel akarom ezt meghívni
);

export const loadItems = createAction(
  LOAD_ITEMS,
  props<{ items: User[] }>()
);
export const loadSelectedItem = createAction(
  LOAD_SELECTED_ITEM,
  props<{ selected: User }>()
);

export const updateItem = createAction(
  UPDATE_ITEM,
  props<{ item: User }>()
);
export const loadUpdatedItem = createAction(
  LOAD_UPDATED_ITEM,
  props<{ item: User }>()
);

export const addItem = createAction(
  ADD_ITEM,
  props<{ item: User }>()
);
export const loadAddedItem = createAction(
  LOAD_ADDED_ITEM,
  props<{ item: User }>()
);

export const deleteItem = createAction(
  DELETE_ITEM,
  props<{ item: User }>()
);
export const removeDeletedItem = createAction(
  REMOVE_ITEM,
  props<{ item: User }>()
);

export const errorItem = createAction(
  ERROR_ITEM,
  props<{ error: any }>()
);

export const errorFlush = createAction(FLUSH_ERROR);        // ez kiüríti a store-ból a hibá(ka)t

