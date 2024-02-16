import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IKartuKeluarga } from './kartukeluarga.model';
import { IPenduduk } from '../penduduk/penduduk.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { KartuKeluargaService } from './kartu-keluarga.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-kartu-keluarga',
  templateUrl: './kartu-keluarga.component.html',
  styleUrls: ['./kartu-keluarga.component.css'],
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
export class KartuKeluargaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSizeOptions = [5, 10, 25];
  public totalItems = 0;
  public page = 0;
  public itemsPerPage = 10;

  public dataSource = new MatTableDataSource<any>();
  public loading = false;
  public keyword: string;
  public dataPenduduk: IPenduduk;
  public displayedColumns: string[] = ['no', 'noKK', 'namaKepalaKeluarga'];

  public displayColumns: string[] = [
    'no',
    'noKtp',
    'namaLengkap',
    'jenisKelamin',
    'ttl',
    'agama',
    'foto',
  ];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  constructor(
    private route: Router,
    private actvatedRoutei: ActivatedRoute,
    protected kartuKeluargaService: KartuKeluargaService
  ) {}

  ngOnInit(): void {
    console.log('zzzzz');
    this.loadData();
  }

  private loadData(): void {
    console.log('Loading data for page:', this.page);
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      sort: 'asc',
    };

    this.kartuKeluargaService.getAll(params).subscribe((data) => {
      console.log('data', data);
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      console.log('data Source', this.dataSource.data);
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

  onSearch(): void {
    this.loading = true;
    const params = {
      keyword: this.keyword,
      page: this.page,
      size: this.itemsPerPage,
      sort: 'id,asc', // Specify the default sorting property and direction
    };

    this.kartuKeluargaService
      .searchKartuKeluarga(
        params.keyword,
        params.page,
        params.size,
        params.sort
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      });
  }
}
