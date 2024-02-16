import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { ISuratPengantar } from '../surat-pengantar.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { SuratPengantarService } from '../surat-pengantar.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { IPenduduk, Penduduk } from '../../penduduk/penduduk.model';
import { PendudukService } from '../../penduduk/penduduk.service';

// Define the custom date format
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MM/YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'DD/MM/YYYY',
  },
};
@Component({
  selector: 'jhi-surat-pengantar-dialog',
  templateUrl: './surat-pengantar-dialog.component.html',
  styleUrls: ['../surat-pengantar.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SuratPengantarDialogComponent implements OnInit {
  public suratPengantar: ISuratPengantar;
  penduduk: IPenduduk = new Penduduk();
  getNoKtp: IPenduduk[] = [];
  getPenduduk: IPenduduk[];
  selectedPenduduk: IPenduduk;
  isNoKtpDisabled: boolean = true; // Default: disabled
  mode: string;
  public noKartuKeluarga: string;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      suratPengantar: ISuratPengantar;
      view: false;
      mode: string;
    },
    protected messageService: MessageService,
    private pendudukService: PendudukService,
    private datePipe: DatePipe,

    private _dialog: MatDialogRef<SuratPengantarDialogComponent>,
    protected suratPengantarService: SuratPengantarService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe((_) => {
      this.openCancelDialog();
    });
    this.mode = this.data.mode;
    this.suratPengantar = this.data.suratPengantar;

    console.log(this.suratPengantar);
  }

  ngOnInit(): void {
    // Panggil fungsi generate saat buka dialog untuk mengisi nilai default
    if (!this.suratPengantar.id) {
      this.generateAutoCodes(); // Call the function to generate auto codes
    }
    this.loadAllPenduduk();

    if (this.mode === 'edit') {
      this.noKartuKeluarga = this.suratPengantar.penduduk.kartuKeluarga.noKK;
      this.penduduk.kartuKeluarga.noKK = this.noKartuKeluarga;
      this.searchNoKK(); // Trigger the search to fetch and display other related information
    }
  }

  private loadAllPenduduk(): void {
    const params = {
      page: 0,
      size: 9999,
      sort: 'asc',
    };

    this.pendudukService.getAll(params).subscribe((data) => {
      const penduduks = data.filter(
        (p: { newStatusPenduduk: string }) => p.newStatusPenduduk === null
      );
      // this.getPenduduk = data;
      this.getPenduduk = penduduks;

      // this.items.paginator = this.paginator;
      // this.loading = false;
    });
  }

  onNoKKChange() {
    if (this.mode === 'add') {
      this.noKartuKeluarga = this.penduduk.kartuKeluarga.noKK;
    } else {
      this.noKartuKeluarga = this.suratPengantar.penduduk.kartuKeluarga.noKK;
    }
    const isMatchingNoKK = this.getPenduduk.some(
      (p) => p.kartuKeluarga.noKK === this.noKartuKeluarga
    );

    if (!this.noKartuKeluarga) {
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

  clearSearch() {
    this.penduduk.kartuKeluarga.noKK = ''; // Clear the search field
    this.getNoKtp = []; // Clear the search results
    this.selectedPenduduk = null; // Clear the selected penduduk
    this.isNoKtpDisabled = true;
  }

  selectPenduduk(selectedPenduduk: IPenduduk) {
    if (selectedPenduduk) {
      this.selectedPenduduk = selectedPenduduk;
    } else {
      this.selectedPenduduk = null;
    }
  }

  searchNoKK() {
    if (!this.noKartuKeluarga) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `No KK Harus Diisi Terlebih Dahulu !`,
      });
      this.isNoKtpDisabled = true;
      this.selectedPenduduk = null;
      this.clearSearch();
      return;
    }

    this.pendudukService.getPendudukByNoKK(this.noKartuKeluarga).subscribe(
      (data) => {
        const datas = Array.isArray(data)
          ? data.filter((e) =>
              this.mode === 'edit'
                ? e.newStatusPenduduk === null
                : e.newStatusPenduduk === null
            )
          : [];

        this.getNoKtp = datas;

        if (this.mode === 'edit') {
          const matchingPenduduk = datas.find(
            (p) => p.noKtp === this.suratPengantar.penduduk.noKtp
          );

          this.isNoKtpDisabled = matchingPenduduk ? false : true;
          this.selectedPenduduk = matchingPenduduk || null;
        } else {
          this.isNoKtpDisabled = false;
          this.selectedPenduduk = null;
        }

        if (datas.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No KK dengan nomor ${this.noKartuKeluarga} tidak terdaftar atau tidak ada.`,
          });
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
        this.isNoKtpDisabled = true;
        this.clearSearch();
      }
    );
  }

  // searchNoKK() {
  //   if (!this.noKartuKeluarga) {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: `No KK Harus Diisi Terlebih Dahulu !`,
  //     });
  //     this.isNoKtpDisabled = true;
  //     this.selectedPenduduk = null;
  //     this.clearSearch();
  //     return;
  //   }

  //   this.pendudukService.getPendudukByNoKK(this.noKartuKeluarga).subscribe(
  //     (data) => {
  //       if (Array.isArray(data) && data.length > 0) {
  //         const datas = data.filter((e) => e.newStatusPenduduk === null);
  //         this.getNoKtp = datas;

  //         if (this.mode === 'edit') {
  //           const matchingPenduduk = datas.find(
  //             (p) => p.noKtp === this.suratPengantar.penduduk.noKtp
  //           );

  //           if (matchingPenduduk) {
  //             this.selectedPenduduk = matchingPenduduk;
  //             this.isNoKtpDisabled = false;
  //           } else {
  //             this.isNoKtpDisabled = true;
  //             this.selectedPenduduk = null;
  //           }
  //         } else {
  //           this.isNoKtpDisabled = false; // Enable for 'add' mode
  //           this.selectedPenduduk = null;
  //         }
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: `No KK dengan nomor ${this.noKartuKeluarga} tidak terdaftar atau tidak ada.`,
  //         });
  //         this.isNoKtpDisabled = true;
  //         this.clearSearch();
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching data:', error);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Terjadi kesalahan saat mengambil data. Silakan coba lagi.',
  //       });
  //       this.isNoKtpDisabled = true;
  //       this.clearSearch();
  //     }
  //   );
  // }

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
  public save() {
    this.validate().then(() => this.preSave());
  }

  public preSave() {
    const request = {
      // Build your request object based on your form data
      // For example:
      noSuratPengantar: this.suratPengantar.noSuratPengantar,
      pendudukId: this.selectedPenduduk.id,
      keterangan: this.suratPengantar.keterangan,
      tanggalSurat: this.formatDate(this.suratPengantar.tanggalSurat),
      keperluan: this.suratPengantar.keperluan,
    };

    if (this.suratPengantar.id) {
      this.suratPengantarService
        .update(request, this.suratPengantar.id)
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
          this._dialog.close(res.body);
        });
    } else {
      this.suratPengantarService.create(request).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    }
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
      noSuratPengantar: true,
      keterangan: true,
      keperluan: true,
      tanggalSurat: true,
      noKK: true,
    };

    if (!this.suratPengantar.noSuratPengantar) {
      this._showNotification('error', 'Masukkan Kode Pindah terlebih dahulu');
      mustValidate.noSuratPengantar = false;
    }

    if (!this.suratPengantar.tanggalSurat) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification(
        'error',
        'Pilih Tanggal Surat Pengantar terlebih dahulu'
      );
      mustValidate.tanggalSurat = false;
    }
    if (!this.suratPengantar.keterangan) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification(
        'error',
        'Masukan Keterangan Surat Pengantar terlebih dahulu'
      );
      mustValidate.keterangan = false;
    }
    if (!this.suratPengantar.keperluan) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification(
        'error',
        'Masukan Keperluan Surat Pengantar terlebih dahulu'
      );
      mustValidate.keperluan = false;
    }
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

  private generateAutoCodes(): void {
    // Generate kodePindah: PDH-tahun-nomor (6 digits)
    const year = moment().year();
    const kodeSurat = `SRP-${year}${this.generateRandomNumber(100000, 999999)}`;
    this.suratPengantar.noSuratPengantar = kodeSurat;
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private formatDate(date: Date | string): string {
    // Ensure the input is a Date object before formatting
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
