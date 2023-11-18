import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { AbstractEntityService } from './abstract-entity.service';

@Component({
  template: '',
})
export class AbstractEntityMaterialComponent<T> {
  @Input() mode: 'card' | 'item' | 'edit' | 'simple' | 'view' | 'loan' = 'edit';

  protected entityKeyName: string;
  protected reverse: any;

  protected horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  protected verticalPosition: MatSnackBarVerticalPosition = 'top';
  protected durationInSecond: Number = 2;

  public currentSearch: string;
  public predicate: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public items: any;
  public itemsPartner: any;

  public paginatorLength: number;
  public paginatorPageSize: number;
  public pageEvent: PageEvent;
  public paginatorPageSizeOption: number[] = [10, 20, 30];
  public loading: boolean;
  public itemsPerPage: any;
  public page: number;

  constructor(
    protected _snackBar: MatSnackBar,
    protected itemService: AbstractEntityService<T>,
    protected messageService?: MessageService
  ) {}

  addIdx(data: Record<string, any>[]): Record<string, any>[] {
    if (data.length > 0 && data) {
      for (let i = 0; i < data.length; i++) {
        data[i]['idx'] = i;
      }
    }

    return data;
  }

  protected manipulateData(data: T[]): Object[] {
    return data;
  }

  initDataForMatTable(data: any, headers: HttpHeaders) {
    this.items = new MatTableDataSource(
      this.addIdx(this.manipulateData(data.body))
    );
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.items.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
  }

  loadDataLazy(event?: PageEvent) {
    this.items = null;
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.postLoadDataLazy();
  }

  preLoad(res: HttpResponse<T[]>): HttpResponse<T[]> {
    res.body.forEach((item) => {});
    return res;
  }

  protected onError(errorMessage: string) {
    this._snackBar.open(errorMessage, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSecond.valueOf() * 1000,
    });
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
    });
  }

  protected showErrorWithSnackBarMaterial(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSecond.valueOf() * 1000,
    });
  }

  rebuildIndex() {
    this.itemService
      .process(
        {},
        {
          processName: 'initializeIndex',
        }
      )
      .subscribe((r) => {
        this._snackBar.open('Rebuild Index', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: this.durationInSecond.valueOf() * 1000,
        });
      });
  }

  sortData() {
    if (this.currentSearch) {
      return [];
    }
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== this.entityKeyName) {
      result.push(this.entityKeyName);
    }
    return result;
  }

  protected postLoadDataLazy() {}
}
interface MyObject {
  idx: number;
  // Add other properties if needed
}
