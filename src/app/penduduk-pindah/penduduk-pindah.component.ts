import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractEntityMaterialComponent } from '../shared/base/abstract-entity-material.component';
import { IPendudukPindah, PendudukPindah } from './penduduk-pindah.model';
import { PendudukPindahService } from './penduduk-pindah.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IPenduduk } from '../penduduk/penduduk.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PendudukPindahCreateComponent } from './penduduk-pindah-create/penduduk-pindah-create.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  DetailPendudukPindah,
  IDetailPendudukPindah,
} from './detail-penduduk-pindah/detail-penduduk-pindah.model';
import { DetailPendudukPindahComponent } from './detail-penduduk-pindah/detail-penduduk-pindah.component';
import { DetailPendudukPindahService } from './detail-penduduk-pindah/detail-penduduk-pindah.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-penduduk-pindah',
  templateUrl: './penduduk-pindah.component.html',
  styleUrls: ['./penduduk-pindah.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PendudukPindahComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = [
    'no',
    'kodePindah',
    'noSuratPindah',
    'tanggalPindah',
    'tanggalSuratPindah',
    'alamatPindah',
    'keteranganPindah',
    'action',
  ];
  public displayColumns: string[] = [
    'no',
    'kodePindah',
    'noKK',
    'noKtp',
    'namaLengkap',
    'jenisKelamin',
    'ttl',
    'agama',
    'foto',
    'action',
  ];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  public pageSizeOptions = [5, 10, 25];
  public totalItems = 0;
  public page = 0;
  public itemsPerPage = 10;

  public dataSource = new MatTableDataSource<IPendudukPindah>();
  public dataSourceDetailPindah: IDetailPendudukPindah;
  public loading = false;
  public keyword: string;
  public dataPenduduk: IPenduduk;

  constructor(
    protected _snackbar: MatSnackBar,
    protected pendudukPindahService: PendudukPindahService,
    private detailPendudukPindahService: DetailPendudukPindahService,
    private route: Router,
    private actvatedRoutei: ActivatedRoute,
    protected dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    console.log('Loading data for page:', this.page);
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      sort: 'asc',
    };

    this.pendudukPindahService.getAll(params).subscribe((data) => {
      this.dataSource = new MatTableDataSource<IPendudukPindah>(
        data.pendudukPindah
      );
      this.dataSource.paginator = this.paginator;
    });
  }

  onSearch(): void {
    this.loading = true;
    const params = {
      keyword: this.keyword,
      page: this.page,
      size: this.itemsPerPage,
      sort: 'id,asc', // Specify the default sorting property and direction
    };

    this.pendudukPindahService
      .searchPendudukPindah(
        params.keyword,
        params.page,
        params.size,
        params.sort
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<IPendudukPindah>(
          data.pendudukPindah
        );
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      });
  }

  // Dialog Add Data
  public openDialog(element: IPendudukPindah = null): void {
    let predicate: IPendudukPindah;
    predicate = new PendudukPindah();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(PendudukPindahCreateComponent, {
      width: '100%',
      data: {
        pendudukPindah: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IPendudukPindah) => {
      if (res) {
        this.loadData();
      }
    });
  }

  public deletePindah(element: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Detail Pindah',
        message: 'Are you sure to delete penduduk pindah data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.pendudukPindahService.delete(element).subscribe(
          (response) => {
            console.log('Delete response:', element.id);

            // Handle success response here
            console.log('Delete success:', response);
            this.loadData(); // Refresh data after successful deletion

            // Display success notification message
            const notificationMessage = `
                        <div>
                            <strong>Data Penduduk Pindah berhasil Di hapus:</strong>
                        </div>
                    `;

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: notificationMessage,
              life: 2000,
            });
          },
          (error) => {
            // Handle error if needed
            console.error('Error deleting detail pindah:', error);
          }
        );
      }
    });
  }

  public selectedPendudukPindah: IPendudukPindah;

  // Get Penduduk
  public expandData(param: IPendudukPindah): void {
    this.selectedPendudukPindah = param;
    this.pendudukPindahService
      .getByKodePindah(param.kodePindah)
      .subscribe((res) => {
        this.dataSourceDetailPindah = res;
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

  openDialogPricing(element: IDetailPendudukPindah = null): void {
    let predicate: IDetailPendudukPindah;
    predicate = new DetailPendudukPindah();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(DetailPendudukPindahComponent, {
      width: '100%',
      data: {
        detailPindahParameter: predicate,
        dataPindah: this.selectedPendudukPindah, // Pass the selectedPenduduk here
      },
    });

    dialogRef.afterClosed().subscribe((res: IDetailPendudukPindah) => {
      if (res) {
        this.loadData();
      }
    });
  }

  public onDeleteDetailPindah(element: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Detail Pindah',
        message: 'Are you sure to delete this detail pindah data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.detailPendudukPindahService.delete(element).subscribe(
          (response) => {
            console.log('Delete response:', element.id);

            // Handle success response here
            console.log('Delete success:', response);
            this.loadData(); // Refresh data after successful deletion

            // Display success notification message
            const notificationMessage = `
                        <div>
                            <strong>Detail Penduduk Pindah berhasil Di hapus:</strong>
                        </div>
                    `;

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: notificationMessage,
              life: 2000,
            });
          },
          (error) => {
            // Handle error if needed
            console.error('Error deleting detail pindah:', error);
          }
        );
      }
    });
  }
}
