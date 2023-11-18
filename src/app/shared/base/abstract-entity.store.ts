import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  defer,
  iif,
  Observable,
  of,
} from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AbstractEntityService } from './abstract-entity.service';

export const CREATE_ITEM = '[Data] Create Item';
export const READ_ITEM = '[Data] Read Item';
export const PUSH_ITEM = '[Data] Push Item';
export const UPDATE_ITEM = '[Data] Update Item';
export const DELETE_ITEM = '[Data] Delete Item';
export const LOAD_ITEMS = '[Data] Load Items';
export const ASSIGN_ITEMS = '[Data] Assign Items';
export const PROCESS_TASK = '[Data] Process Task';

export interface Action {
  type: string;
  payload?: any;
}

export interface IState<T> {
  item?: T;
  items?: T[];
  error?: any;
  id?: any;
}

@Injectable({ providedIn: 'root' })
export class AbstractEntityStore<T> {
  protected stateSubject = new BehaviorSubject<any>(this.initialState());
  readonly state$: Observable<any> = this.stateSubject.asObservable();

  protected useTask: boolean;

  constructor(protected itemService: AbstractEntityService<T>) {
    this.useTask = false;
  }

  get item$(): Observable<T> {
    return this.state$.pipe(map((res) => res.item));
  }

  get items$(): Observable<T[]> {
    return this.state$.pipe(map((res) => res.items));
  }

  get tasks$(): Observable<T> {
    return this.state$.pipe(map((res) => res.tasks));
  }

  protected isEqualId(src: any, tgt: any): boolean {
    return src.id === tgt.id;
  }

  protected id(item: any): any {
    return item.id;
  }

  protected preSave(state: any): Observable<any> {
    return of(state);
  }

  protected postSave(state: any) {}

  protected initialState(): any {
    return {
      items: [],
      item: null,
      tasks: [],
      error: {},
    };
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected onError(err: any, def: any): Observable<any> {
    this.displayMessage('error', 'Data Error', err);
    return of(def);
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    return of(state);
  }

  protected displayMessage(severity: string, summary: string, detail: string) {}

  loadData() {
    this.itemService.query({ size: 99999 }).subscribe((res) => {
      const currentState = this.stateSubject.getValue();
      // new State
      const newState = {
        ...currentState,
        error: {},
        items: res.body,
      };
      this.stateSubject.next(newState);
    });
  }

  protected saveItem$(state: any): Observable<any> {
    return this.prepareSaveEffect(state).pipe(
      mergeMap((newState) => this.preSave(newState)),
      mergeMap((newState) =>
        this.itemService.save(newState.item).pipe(
          map((res) => res.body),
          catchError((err) => this.onError(err, of(newState.item))),
          map((res) => ({ ...newState, item: res }))
        )
      ),
      // Save Child Data
      mergeMap((newState) => this.buildDependencyEffect(newState))
    );
  }

  protected _updateItem(action: Action): Observable<any> {
    const item: T = action.payload;
    const prevState = this.stateSubject.getValue();
    return this.saveItem$(prevState).pipe(
      map((state) => {
        const newItems = this.updateItemsFrom(
          state.items.slice(0),
          state.item,
          (r, s) => this.isEqualId(r, s)
        );
        // new State
        const newState = { ...state, error: {}, items: newItems };
        this.postSave(newState);
        this.displayMessage('info', 'Data Saved', 'Data saved ...');
        return newState;
      })
    );
  }

  protected _deleteItem(action: Action): Observable<any> {
    const item: T = action.payload;
    const prevState = this.stateSubject.getValue();
    return this.itemService.delete(this.id(item)).pipe(
      map(() => prevState),
      map((state) => {
        const newItems = this.removeItemBy(
          state.items.slice(0),
          state,
          (r, s) => this.isEqualId(r, s)
        );
        const res = this.isEqualId(state.item, item) ? null : state.item;

        // new State
        return { ...state, error: {}, items: newItems, item: res };
      })
    );
  }

  updateItemsFrom(
    source: T[],
    item: T,
    fn: (res: T, val: any) => boolean
  ): T[] {
    let newItems = source.slice(0);
    // Cek di list
    const index = newItems.findIndex((res: T) => fn(res, item));
    if (index > -1) {
      newItems[index] = item;
    } else {
      if (this.id(item)) {
        newItems = [...newItems, item];
      }
    }
    return newItems;
  }

  removeItemBy(source: T[], item: T, fn: (res: T, val: any) => boolean): T[] {
    const newItems: T[] = source.slice(0);
    // Cek di master
    const index = newItems.findIndex((curr: T) => fn(curr, item));
    if (index > -1) {
      newItems.slice(index, 1);
    }
    return newItems;
  }
}
