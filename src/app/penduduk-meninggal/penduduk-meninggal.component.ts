import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IPendudukMeninggal,
  PendudukMeninggal,
} from './penduduk-meninggal.model';
import { IPenduduk } from '../penduduk/penduduk.model';
import { PendudukMeninggalService } from './penduduk-meninggal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { PendudukMeninggalCreateComponent } from './penduduk-meninggal-create/penduduk-meninggal-create.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-penduduk-meninggal',
  templateUrl: './penduduk-meninggal.component.html',
  styleUrls: ['./penduduk-meninggal.component.css'],
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
export class PendudukMeninggalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSizeOptions = [5, 10, 25];
  public totalItems = 0;
  public page = 0;
  public itemsPerPage = 10;

  public dataSource = new MatTableDataSource<IPendudukMeninggal>();
  public loading = false;
  public keyword: string;
  public dataPenduduk: IPenduduk;
  public displayedColumns: string[] = [
    'no',
    'kode',
    'tanggalWafat',
    'penyebab',
    'noSurat',
    'tglSurat',
    'keterangan',
    'foto',
    'action',
  ];

  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  constructor(
    protected _snackbar: MatSnackBar,
    private route: Router,
    private actvatedRoutei: ActivatedRoute,
    protected dialog: MatDialog,
    private messageService: MessageService,
    protected pendudukMeninggalService: PendudukMeninggalService
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

    this.pendudukMeninggalService.getAll(params).subscribe((data) => {
      this.dataSource = new MatTableDataSource<IPendudukMeninggal>(data);
      this.dataSource.paginator = this.paginator;
    });
    console.log('data Source', this.dataSource);
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

  // Dialog Add Data
  public openDialog(element: IPendudukMeninggal = null, mode: string): void {
    let predicate: IPendudukMeninggal;
    predicate = new PendudukMeninggal();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(PendudukMeninggalCreateComponent, {
      width: '100%',
      data: {
        pendudukMeninggal: predicate,
        mode,
      },
    });
    dialogRef.afterClosed().subscribe((res: IPendudukMeninggal) => {
      if (res) {
        this.loadData();
      }
    });
  }

  public deleteMeninggal(element: any): void {
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
        this.pendudukMeninggalService.delete(element).subscribe(
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

  onSearch(): void {
    this.loading = true;
    const params = {
      keyword: this.keyword,
      page: this.page,
      size: this.itemsPerPage,
      sort: 'id,asc', // Specify the default sorting property and direction
    };

    this.pendudukMeninggalService
      .searchPendudukMeninggal(
        params.keyword,
        params.page,
        params.size,
        params.sort
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<IPendudukMeninggal>(data);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      });
  }
}
