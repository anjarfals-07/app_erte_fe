import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { PendudukMeninggalService } from '../penduduk-meninggal.service';
import { IPendudukMeninggal } from '../penduduk-meninggal.model';
import { IPenduduk, Penduduk } from 'src/app/penduduk/penduduk.model';
import { PendudukService } from 'src/app/penduduk/penduduk.service';
import { DatePipe } from '@angular/common';

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
  selector: 'app-penduduk-meninggal-create',
  templateUrl: './penduduk-meninggal-create.component.html',
  styleUrls: ['../penduduk-meninggal.component.css'],
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
export class PendudukMeninggalCreateComponent implements OnInit {
  public pendudukMeninggal: IPendudukMeninggal;
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
      pendudukMeninggal: IPendudukMeninggal;
      view: false;
      mode: string;
    },
    protected messageService: MessageService,
    private pendudukService: PendudukService,

    private _dialog: MatDialogRef<PendudukMeninggalCreateComponent>,
    protected pendudukMeninggalService: PendudukMeninggalService,
    private datePipe: DatePipe
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe((_) => {
      this.openCancelDialog();
    });
    this.mode = this.data.mode;
    this.pendudukMeninggal = this.data.pendudukMeninggal;
  }

  ngOnInit(): void {
    // Panggil fungsi generate saat buka dialog untuk mengisi nilai default
    if (!this.pendudukMeninggal.id) {
      this.generateAutoCodes(); // Call the function to generate auto codes
    }
    this.loadAllPenduduk();

    if (this.mode === 'edit') {
      this.noKartuKeluarga = this.pendudukMeninggal.penduduk.kartuKeluarga.noKK;
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
      let penduduks;
      if (this.mode === 'add') {
        penduduks = data.filter(
          (p: { newStatusPenduduk: string }) => p.newStatusPenduduk === null
        );
      } else {
        penduduks = data.filter(
          (p: { newStatusPenduduk: string }) =>
            p.newStatusPenduduk === 'MENINGGAL' || p.newStatusPenduduk === null
        );
      }

      this.getPenduduk = penduduks;
      // this.getPenduduk = penduduks;

      console.log('data penduduk', this.getPenduduk);
      // this.items.paginator = this.paginator;
      // this.loading = false;
    });
  }

  onNoKKChange() {
    if (this.mode === 'add') {
      this.noKartuKeluarga = this.penduduk.kartuKeluarga.noKK;
    } else {
      this.noKartuKeluarga = this.pendudukMeninggal.penduduk.kartuKeluarga.noKK;
    }
    const isMatchingNoKK = this.getPenduduk.some(
      (p) => p.kartuKeluarga.noKK === this.noKartuKeluarga
    );
    console.log('is match', isMatchingNoKK);

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
                ? e.newStatusPenduduk === 'MENINGGAL' ||
                  e.newStatusPenduduk === null
                : e.newStatusPenduduk === null
            )
          : [];

        this.getNoKtp = datas;

        if (this.mode === 'edit') {
          const matchingPenduduk = datas.find(
            (p) => p.noKtp === this.pendudukMeninggal.penduduk.noKtp
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
  //   const noKK = this.penduduk.kartuKeluarga.noKK;
  //   if (!noKK) {
  //     console.log('no kk', noKK);
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Warning',
  //       detail: `No KK Harus Diisi Terlebih Dahulu !`,
  //     });
  //     this.isNoKtpDisabled = true; // Menonaktifkan field No KTP
  //     this.selectedPenduduk = null; // Mengatur selectedPenduduk menjadi null
  //     this.clearSearch(); // Bersihkan hasil pencarian sebelumnya
  //     return;
  //   }

  //   this.pendudukService.getPendudukByNoKK(noKK).subscribe(
  //     (data) => {
  //       if (Array.isArray(data) && data.length > 0) {
  //         const datas = data.filter((e) => e.newStatusPenduduk === null);
  //         this.getNoKtp = datas;

  //         this.isNoKtpDisabled = false; // Mengaktifkan field No KTP
  //       } else {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: `No KK dengan nomor ${noKK} tidak terdaftar atau tidak ada.`,
  //         });
  //         this.isNoKtpDisabled = true; // Menonaktifkan field No KTP
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
  //       this.isNoKtpDisabled = true; // Menonaktifkan field No KTP
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
      kodeMeninggal: this.pendudukMeninggal.kodeMeninggal,
      pendudukId: this.selectedPenduduk.id,
      penyebab: this.pendudukMeninggal.penyebab,
      suratKeteranganMeninggalRequest: {
        noSuratMeninggal:
          this.pendudukMeninggal.suratKeteranganMeninggal.noSuratMeninggal,
        tanggalSuratMeninggal: this.formatDate(
          this.pendudukMeninggal.suratKeteranganMeninggal.tanggalSuratMeninggal
        ),
        keteranganSuratMeninggal:
          this.pendudukMeninggal.suratKeteranganMeninggal
            .keteranganSuratMeninggal,
      },
      tanggalWafat: this.formatDate(this.pendudukMeninggal.tanggalWafat),
    };

    if (this.pendudukMeninggal.id) {
      this.pendudukMeninggalService
        .update(request, this.pendudukMeninggal.id)
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
          this._dialog.close(res.body);
        });
    } else {
      this.pendudukMeninggalService.create(request).subscribe((res) => {
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
      kodePindah: true,
      tanggalPindah: true,
      alamat: true,
      noSurat: true,
      tanggalSurat: true,
      noKK: true,
    };
    if (this.mode === 'edit' || this.mode === 'view') {
      if (!this.pendudukMeninggal.kodeMeninggal) {
        this._showNotification('error', 'Masukkan Kode Pindah terlebih dahulu');
        mustValidate.kodePindah = false;
      }

      if (!this.pendudukMeninggal.tanggalWafat) {
        // Handle the case when selectedPenduduk is undefined
        this._showNotification('error', 'Pilih Tanggal Pindah terlebih dahulu');
        mustValidate.tanggalPindah = false;
      }
      if (!this.pendudukMeninggal.penyebab) {
        // Handle the case when selectedPenduduk is undefined
        this._showNotification('error', 'Pilih Alamat Pindah terlebih dahulu');
        mustValidate.alamat = false;
      }
      if (!this.pendudukMeninggal.suratKeteranganMeninggal.noSuratMeninggal) {
        // Handle the case when selectedPenduduk is undefined
        this._showNotification(
          'error',
          'Pilih No Surat Pindah terlebih dahulu'
        );
        mustValidate.noSurat = false;
      }
      if (
        !this.pendudukMeninggal.suratKeteranganMeninggal.tanggalSuratMeninggal
      ) {
        // Handle the case when selectedPenduduk is undefined
        this._showNotification(
          'error',
          'Pilih Tanggal Surat Pindah terlebih dahulu'
        );
        mustValidate.tanggalSurat = false;
      }
      if (!this.penduduk.kartuKeluarga.noKK) {
        this._showNotification('error', 'Masukkan No KK terlebih dahulu');
        mustValidate.noKK = false;
      }
      if (!this.selectedPenduduk) {
        // Handle the case when selectedPenduduk is undefined
        this._showNotification(
          'error',
          'Pilih No Ktp penduduk  terlebih dahulu'
        );
        return false;
      }
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
    const kodeMeninggal = `PMD-${year}${this.generateRandomNumber(
      100000,
      999999
    )}`;
    this.pendudukMeninggal.kodeMeninggal = kodeMeninggal;

    // Generate noSuratPindah: SPDH-tahun-nomor (6 digits)
    const noSuratMeninggal = `SKM-${year}${this.generateRandomNumber(
      100000,
      999999
    )}`;
    this.pendudukMeninggal.suratKeteranganMeninggal.noSuratMeninggal =
      noSuratMeninggal;
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  formatDate(date: Date | string): string {
    // Ensure the input is a Date object before formatting
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
