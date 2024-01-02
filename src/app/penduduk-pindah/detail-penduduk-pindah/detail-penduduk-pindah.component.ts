import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPendudukPindah, PendudukPindah } from '../penduduk-pindah.model';
import { PendudukPindahService } from '../penduduk-pindah.service';
import {
  DetailPendudukPindah,
  IDetailPendudukPindah,
} from './detail-penduduk-pindah.model';
import { DetailPendudukPindahService } from './detail-penduduk-pindah.service';
import { IPenduduk, Penduduk } from 'src/app/penduduk/penduduk.model';
// import { Message, MessageService } from 'primeng/api';
import { PendudukService } from 'src/app/penduduk/penduduk.service';
import { MessageService } from 'primeng/api';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { includes } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail-penduduk-pindah',
  templateUrl: './detail-penduduk-pindah.component.html',
  styleUrls: ['../penduduk-pindah.component.css'],
})
export class DetailPendudukPindahComponent implements OnInit {
  public detailPindahParameter: IDetailPendudukPindah;
  dataPindah: IPendudukPindah;
  id: number;
  pendudukPindah: IPendudukPindah = new PendudukPindah();
  penduduk: IPenduduk = new Penduduk();
  getNoKtp: IPenduduk[] = [];
  getPenduduk: IPenduduk[];
  selectedPenduduk: IPenduduk;
  isNoKtpDisabled: boolean = true; // Default: disabled
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pendudukPindahService: PendudukPindahService,
    private detailPendudukPindahService: DetailPendudukPindahService,
    private messageService: MessageService,
    private pendudukService: PendudukService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      detailPindahParameter: IDetailPendudukPindah;
      dataPindah: IPendudukPindah;
      view: false;
      mode: string;
    },
    private _dialog: MatDialogRef<DetailPendudukPindahComponent>
  ) {
    this.detailPindahParameter = this.data.detailPindahParameter;
    this.dataPindah = this.data.dataPindah;
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe((_) => {
      this.openCancelDialog();
    });
    console.log('data pindah', this.dataPindah);
  }
  ngOnInit(): void {
    this.loadAllPenduduk();
  }

  public noKK: string;
  private loadAllPenduduk(): void {
    const params = {
      page: 0,
      size: 9999,
      sort: 'asc',
    };

    this.pendudukService.getAll(params).subscribe((data) => {
      const penduduks = data.filter(
        (p: { newStatusPenduduk: string }) => p.newStatusPenduduk !== 'PINDAH'
      );
      // this.getPenduduk = data;
      this.getPenduduk = penduduks;

      console.log('data penduduk', this.getPenduduk);
      // this.items.paginator = this.paginator;
      // this.loading = false;
    });
  }

  // Modify the searchNoKK function
  searchNoKK() {
    const noKK = this.penduduk.kartuKeluarga.noKK;
    if (!noKK) {
      console.log('no kk', noKK);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `No KK Harus Diisi Terlebih Dahulu !`,
      });
      this.isNoKtpDisabled = true; // Menonaktifkan field No KTP
      this.selectedPenduduk = null; // Mengatur selectedPenduduk menjadi null
      this.clearSearch(); // Bersihkan hasil pencarian sebelumnya
      return;
    }

    this.pendudukService.getPendudukByNoKK(noKK).subscribe(
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const datas = data.filter((e) => e.newStatusPenduduk === null);
          this.getNoKtp = datas;

          this.isNoKtpDisabled = false; // Mengaktifkan field No KTP
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No KK dengan nomor ${noKK} tidak terdaftar atau tidak ada.`,
          });
          this.isNoKtpDisabled = true; // Menonaktifkan field No KTP
          this.clearSearch();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Terjadi kesalahan saat mengambil data. Silakan coba lagi.',
        });
        this.isNoKtpDisabled = true; // Menonaktifkan field No KTP
        this.clearSearch();
      }
    );
  }

  clearSearch() {
    this.penduduk.kartuKeluarga.noKK = ''; // Clear the search field
    this.getNoKtp = []; // Clear the search results
    this.selectedPenduduk = null; // Clear the selected penduduk
    this.isNoKtpDisabled = true;
  }

  onNoKKChange() {
    const noKK = this.penduduk.kartuKeluarga.noKK;
    const isMatchingNoKK = this.getPenduduk.some(
      (p) => p.kartuKeluarga.noKK === noKK
    );
    console.log('is match', isMatchingNoKK);

    if (!noKK) {
      this.isNoKtpDisabled = true;
      this.selectedPenduduk = null;
      this.clearSearch();
      return; // exit the function early if No KK is empty
    }

    if (!isMatchingNoKK) {
      this.isNoKtpDisabled = true;
      this.selectedPenduduk = null;
    }
  }

  selectPenduduk(selectedPenduduk: IPenduduk) {
    console.log('select', selectedPenduduk);
    if (selectedPenduduk) {
      this.selectedPenduduk = selectedPenduduk;
    } else {
      this.selectedPenduduk = null;
    }
  }

  createDetailPindah() {
    const request = {
      pendudukId: this.selectedPenduduk.id,
      pendudukPindahId: this.dataPindah.id,
    };

    const notificationMessage = `
    <div>
      <strong>Detail Penduduk Pindah dengan:</strong> <br>
      <span style="font-weight: bold;">No Ktp :</span> ${this.selectedPenduduk.noKtp} <br>
      <span style="font-weight: bold;">Nama Lengkap :</span> ${this.selectedPenduduk.namaLengkap}
    </div>
  `;

    this.detailPendudukPindahService
      .createDetailPindah(request)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: notificationMessage,
          life: 3000,
        });
        this._dialog.close(res);
      });
  }

  public save() {
    this.validate().then(() => this.createDetailPindah());
  }

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this._dialog.close();
      }
    });
  }

  // Validate
  private _validateProcess(toValidate: any) {
    let isAllTrue = true;
    for (const key in toValidate) {
      if (Object.prototype.hasOwnProperty.call(toValidate, key)) {
        if (toValidate[key] === false) {
          isAllTrue = false;
          break;
        }
      }
    }

    return isAllTrue;
  }

  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized =
      severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({
      severity,
      summary: severityCaptitalized,
      detail: message,
      life: 3000,
    });
  }

  public checkMustValidated() {
    const mustValidate = {
      pendudukPindahId: true,
      pendudukId: true,
      noKtp: true,
      noKK: true,
      namaLengkap: true,
    };

    // if (!this.pendudukPindah.id) {
    //   this._showNotification(
    //     'error',
    //     'Masukkan Id Penduduk Pindah terlebih dahulu'
    //   );
    //   mustValidate.pendudukPindahId = false;
    // }
    if (!this.penduduk.kartuKeluarga.noKK) {
      this._showNotification('error', 'Masukkan No KK terlebih dahulu');
      mustValidate.noKK = false;
    }

    if (!this.selectedPenduduk) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih No Ktp penduduk  terlebih dahulu');
      return false;
    }
    return this._validateProcess(mustValidate);
  }

  public validateMasterCompanyType(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Company Type Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterCompanyType().then(() => resolve(true));
    });
  }
}
