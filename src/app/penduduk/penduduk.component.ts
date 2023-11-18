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
import { MatPaginator } from '@angular/material/paginator';
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
export class PendudukComponent
  extends AbstractEntityMaterialComponent<IPenduduk>
  implements OnInit
{
  // public override items: any = new MatTableDataSource<IPenduduk>([]);
  @ViewChild(MatPaginator) override paginator!: MatPaginator;

  public displayedColumns: string[] = [
    'no',
    'name',
    'ktp',
    'jk',
    'ttl',
    'statusKeluarga',
    'statusPerkawinan',
    'foto',
    'action',
  ];

  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  // public data!: IPenduduk[]; // This should be an array of IPenduduk objects.

  constructor(
    protected _snackbar: MatSnackBar,
    protected pendudukService: PendudukService,
    private route: Router,
    private actvatedRoutei: ActivatedRoute
  ) {
    super(_snackbar, pendudukService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.items = new MatTableDataSource<IPenduduk>([]);
  }

  ngOnInit() {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true; // Set loading to true before making the API call
    this.pendudukService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<IPenduduk[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  protected override postLoadDataLazy(): void {
    this.loadAll();
  }

  previousState(): void {
    window.history.back();
  }
  stopPropagation(event: Event): void {
    event.stopPropagation();
    console.log('Event stopped');
  }
}
