import { Component, Inject, OnInit } from '@angular/core';
import { IPendudukPindah } from '../penduduk-pindah.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { PendudukPindahService } from '../penduduk-pindah.service';
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
  selector: 'app-penduduk-pindah-create',
  templateUrl: './penduduk-pindah-create.component.html',
  styleUrls: ['../penduduk-pindah.component.css'],
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
export class PendudukPindahCreateComponent implements OnInit {
  public pendudukPindah: IPendudukPindah;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pendudukPindah: IPendudukPindah;
      view: false;
      mode: string;
    },
    protected messageService: MessageService,

    private _dialog: MatDialogRef<PendudukPindahCreateComponent>,
    protected pendudukPindahService: PendudukPindahService,
    private datePipe: DatePipe
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe((_) => {
      this.openCancelDialog();
    });
    this.pendudukPindah = this.data.pendudukPindah;
    console.log(this.pendudukPindah);
  }

  ngOnInit(): void {
    // Panggil fungsi generate saat buka dialog untuk mengisi nilai default
    if (!this.pendudukPindah.id) {
      this.generateAutoCodes(); // Call the function to generate auto codes
    }
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

  public save() {
    this.pendudukPindah.tanggalPindah = this.formatDate(
      this.pendudukPindah.tanggalPindah
    );
    this.pendudukPindah.suratKeteranganPindah.tanggalSuratPindah =
      this.formatDate(
        this.pendudukPindah.suratKeteranganPindah.tanggalSuratPindah
      );

    if (this.pendudukPindah.id) {
      this.pendudukPindahService
        .update(this.pendudukPindah, this.pendudukPindah.id)
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
          this._dialog.close(res.body);
        });
    } else {
      this.pendudukPindahService
        .create(this.pendudukPindah)
        .subscribe((res) => {
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
    };

    if (!this.pendudukPindah.kodePindah) {
      this._showNotification('error', 'Masukkan Kode Pindah terlebih dahulu');
      mustValidate.kodePindah = false;
    }

    if (!this.pendudukPindah.tanggalPindah) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Tanggal Pindah terlebih dahulu');
      mustValidate.tanggalPindah = false;
    }
    if (!this.pendudukPindah.alamatPindah) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Alamat Pindah terlebih dahulu');
      mustValidate.alamat = false;
    }
    if (!this.pendudukPindah.suratKeteranganPindah.noSuratPindah) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih No Surat Pindah terlebih dahulu');
      mustValidate.noSurat = false;
    }
    if (!this.pendudukPindah.suratKeteranganPindah.tanggalSuratPindah) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification(
        'error',
        'Pilih Tanggal Surat Pindah terlebih dahulu'
      );
      mustValidate.tanggalSurat = false;
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
    const kodePindah = `PDH-${year}${this.generateRandomNumber(
      100000,
      999999
    )}`;
    this.pendudukPindah.kodePindah = kodePindah;

    // Generate noSuratPindah: SPDH-tahun-nomor (6 digits)
    const noSuratPindah = `SPDH-${year}${this.generateRandomNumber(
      100000,
      999999
    )}`;
    this.pendudukPindah.suratKeteranganPindah.noSuratPindah = noSuratPindah;
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
