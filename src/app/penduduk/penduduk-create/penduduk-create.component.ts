import { Component, Input, OnInit } from '@angular/core';
import { PendudukService } from '../penduduk.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { MessageService } from 'primeng/api';
import { IPenduduk, Penduduk } from '../penduduk.model';
import { AbstractEntityMaterialComponent } from 'src/app/shared/base/abstract-entity-material.component';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-penduduk-create',
  templateUrl: './penduduk-create.component.html',
  styleUrls: ['./penduduk-create.component.css'],
})
export class PendudukCreateComponent
  extends AbstractEntityMaterialComponent<IPenduduk>
  implements OnInit
{
  @Input() penduduk: IPenduduk = new Penduduk();
  public listOfValue = {
    agamaList: [
      'Islam',
      'Kristen',
      'Katolik',
      'Hindu',
      'Budha',
      'Konghucu',
      'Lainnya',
    ],
    pendidikanList: ['SD', 'SMP', 'SMA', 'S1', 'S2', 'S3', 'Lainnya'],
    statusKeluargaList: ['Kepala Keluarga', 'Istri', 'Anak', 'Lainnya'],
    statusperkawinanList: [
      'Kawin',
      'Belum Kawin',
      'Cerai Hidup',
      'Cerai Mati',
      'Lainnya',
    ],
    jenisKelaminList: ['Laki - Laki', 'Perempuan', 'Lainnya'],
    statusPenduduk: ['Tetap', 'Pendatang', 'Pindah', 'Meninggal'],
  };
  selectedFile: File | null = null;
  selectedFileUrl: string | ArrayBuffer | null = null;

  public selectedPhoto: File | null = null;
  constructor(
    private pendudukService: PendudukService,
    protected router: Router,
    protected actRoute: ActivatedRoute,
    protected override _snackBar: MatSnackBar,
    protected override messageService: MessageService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    super(_snackBar, pendudukService);
  }
  ngOnInit(): void {
    console.log(this.penduduk.kartuKeluarga, 'penduduk');
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Display the selected photo preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.selectedFileUrl = reader.result;
      };
    }
  }

  save(): void {
    // Validasi apakah username sudah ada
    this.pendudukService.checkNoKtpAvailability(this.penduduk.noKtp).subscribe(
      (result) => {
        if (!result) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No Ktp Sudah Ada. Mohon pilih No Ktp yang lain.',
          });
        } else {
          this.preSave();
          // Validasi apakah penduduk dengan ID sudah terdaftar sebagai user
        }
      },
      (error) => {
        console.error('Error checkingpenduduk:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Terjadi kesalahan saat memeriksa penduduk. Silakan coba lagi.',
        });
      }
    );
  }

  // save(): void {
  //   this.validate().then(() => this.preSave());
  // }

  preSave(): void {
    if (this.selectedFile) {
      this.penduduk.foto = this.selectedFile;
    }

    if (this.penduduk.tanggallahir instanceof Date) {
      this.penduduk.tanggallahir = this.formatDate(this.penduduk.tanggallahir);
    }

    this.pendudukService.createPenduduk(this.penduduk).subscribe((res) => {
      console.log(res.body);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Successful',
      });

      if (res.body) {
        this.router.navigate(['/penduduk']);
      }
    });
  }
  previousState(): void {
    window.history.back();
  }

  // cancel confrimation dialog
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
        this.previousState();
      }
    });
  }

  // Helper function to format date
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  test() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Save Successful',
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
      noKtp: true,
      noKK: true,
      namaLengkap: true,
      tempatLahir: true,
      tanggalLahir: true,
      alamat: true,
      rt: true,
      rw: true,
      kota: true,
      kodePos: true,
      kelurahan: true,
      kecamatan: true,
      agama: true,
      pekerjaan: true,
      pendidikan: true,
      statusPerkawinan: true,
      jenisKelamin: true,
      statusPenduduk: true,
      namaKepalaKeluarga: true,
      statusKeluarga: true,
    };

    if (!this.penduduk.noKtp) {
      this._showNotification('error', 'Masukkan No KTP terlebih dahulu');
      mustValidate.noKtp = false;
    }

    if (!this.penduduk.kartuKeluarga.noKK) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification(
        'error',
        'Masukan No Kartu Keluarga terlebih dahulu'
      );
      mustValidate.noKK = false;
    }
    if (!this.penduduk.kartuKeluarga.namaKepalaKeluarga) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification(
        'error',
        'Masukan Nama Kepala Keluarga terlebih dahulu'
      );
      mustValidate.namaKepalaKeluarga = false;
    }
    if (!this.penduduk.namaLengkap) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Nama Lengkap terlebih dahulu');
      mustValidate.namaKepalaKeluarga = false;
    }
    if (!this.penduduk.jenisKelamin) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Jenis Kelamin terlebih dahulu');
      mustValidate.jenisKelamin = false;
    }
    if (!this.penduduk.tempatLahir) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Tempat Lahir terlebih dahulu');
      mustValidate.tempatLahir = false;
    }
    if (!this.penduduk.tanggallahir) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Tanggal Lahir terlebih dahulu');
      mustValidate.tanggalLahir = false;
    }
    if (!this.penduduk.agama) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Agama terlebih dahulu');
      mustValidate.agama = false;
    }
    if (!this.penduduk.statusPerkawinan) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification(
        'error',
        'Pilih Status Perkawinan terlebih dahulu'
      );
      mustValidate.statusPerkawinan = false;
    }
    if (!this.penduduk.statusKeluarga) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Status Keluarga terlebih dahulu');
      mustValidate.statusKeluarga = false;
    }
    if (!this.penduduk.statusPenduduk) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Status Penduduk terlebih dahulu');
      mustValidate.statusPenduduk = false;
    }
    if (!this.penduduk.rt) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan NO RT terlebih dahulu');
      mustValidate.rt = false;
    }
    if (!this.penduduk.rw) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan NO RW terlebih dahulu');
      mustValidate.rw = false;
    }
    if (!this.penduduk.kecamatan) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Kecamatan terlebih dahulu');
      mustValidate.kecamatan = false;
    }
    if (!this.penduduk.kelurahan) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Kelurahan terlebih dahulu');
      mustValidate.kelurahan = false;
    }
    if (!this.penduduk.kodePos) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Kode Pos terlebih dahulu');
      mustValidate.kodePos = false;
    }
    if (!this.penduduk.kota) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Kota terlebih dahulu');
      mustValidate.kota = false;
    }
    if (!this.penduduk.alamat) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Alamat terlebih dahulu');
      mustValidate.alamat = false;
    }
    if (!this.penduduk.pekerjaan) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Pekerjaan terlebih dahulu');
      mustValidate.pekerjaan = false;
    }
    if (!this.penduduk.pendidikan) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Pilih Pendidikan terlebih dahulu');
      mustValidate.pendidikan = false;
    }
    return this._validateProcess(mustValidate);
  }

  public validateMasterCompanyType(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterCompanyType().then(() => resolve(true));
    });
  }
}
