import { Component, OnInit, ViewChild } from '@angular/core';
import { PendudukService } from './penduduk.service';
import { AbstractEntityMaterialComponent } from '../shared/base/abstract-entity-material.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { IPenduduk } from './penduduk.model';
import * as lodash from 'lodash';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-penduduk',
  templateUrl: './penduduk.component.html',
  styleUrls: ['./penduduk.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PendudukComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = [
    'no',
    'name',
    'ktp',
    'jk',
    'ttl',
    'statusKeluarga',
    'statusPerkawinan',
    'statusPenduduk',
    'foto',
    'action',
  ];

  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public pageSizeOptions = [5, 10, 25];
  public totalItems = 0;
  public page = 0;
  public itemsPerPage = 10;

  public items = new MatTableDataSource<IPenduduk>();
  public loading = false;

  constructor(
    protected _snackbar: MatSnackBar,
    protected pendudukService: PendudukService,
    private route: Router,
    private actvatedRoutei: ActivatedRoute,
    protected dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      sort: 'asc',
    };

    this.pendudukService.getAll(params).subscribe((data) => {
      this.items = new MatTableDataSource<IPenduduk>(data);
      this.items.paginator = this.paginator;
      this.loading = false;
    });
  }

  // Delete Confirmation
  public onDelete(element: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Category',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.pendudukService.delete(element.id).subscribe(() => {
          this.loadAll();
        });
      }
    });
  }

  public loadDataLazy(event: PageEvent): void {
    console.log('loadDataLazy triggered');
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
  }

  previousState(): void {
    window.history.back();
  }
  stopPropagation(event: Event): void {
    event.stopPropagation();
    console.log('Event stopped');
  }
}
