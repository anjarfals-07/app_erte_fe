import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { IUser, User } from '../user/user.model';
import { IPenduduk, Penduduk } from '../penduduk/penduduk.model';
import { PendudukService } from '../penduduk/penduduk.service';
import { MessageService } from 'primeng/api';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public user: IUser;
  penduduk: IPenduduk = new Penduduk();
  getPenduduk: IPenduduk[];
  public noKtp: string;
  isFieldsVisible: boolean = false;

  constructor(
    private dialog: MatDialog,
    protected pendudukService: PendudukService,
    protected registerService: RegisterService,
    private messageService: MessageService,
    protected router: Router
  ) {
    this.penduduk = new Penduduk();
    this.user = new User();
  }

  ngOnInit(): void {
    this.loadAllPenduduk();
  }

  private loadAllPenduduk(): void {
    const params = {
      page: 0,
      size: 9999,
      sort: 'asc',
    };

    this.pendudukService.getAll(params).subscribe((data) => {
      this.getPenduduk = data;
    });
  }

  onKtpChange() {
    this.noKtp = this.penduduk.noKtp;

    const isMatchingNoKK = this.getPenduduk.some((p) => p.noKtp === this.noKtp);

    if (!this.noKtp) {
      this.hideFields();
      return;
    }

    if (!isMatchingNoKK) {
      this.hideFields();
    } else {
      this.showFields();
      this.searchKtp();
    }
  }

  clearSearch() {
    this.penduduk.noKtp = '';
    this.hideFields();
  }

  private hideFields() {
    this.isFieldsVisible = false;
  }

  private showFields() {
    this.isFieldsVisible = true;
  }

  searchKtp() {
    if (!this.noKtp) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `No KTP must be filled first!`,
      });
      this.hideFields();
      this.clearSearch();
      return;
    }

    this.pendudukService.getPendudukByNoKtp(this.noKtp).subscribe(
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.user.penduduk.id = data[0].id;
          this.user.penduduk.namaLengkap = data[0].namaLengkap;
          this.user.penduduk.jenisKelamin = data[0].jenisKelamin;
          this.user.penduduk.email = data[0].email;
          this.user.penduduk.telepon = data[0].telepon;

          this.showFields();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No KTP with number ${this.noKtp} is not registered or does not exist.`,
          });
          this.hideFields();
          this.clearSearch();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while fetching data. Please try again.',
        });
        this.hideFields();
        this.clearSearch();
      }
    );
  }

  previousState(): void {
    window.history.back();
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
        this.previousState();
      }
    });
  }

  save(): void {
    // Validasi apakah username sudah ada
    this.registerService
      .checkUsernameAvailability(this.user.username)
      .subscribe(
        (result) => {
          if (!result) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Username Sudah Ada, Mohon pilih Username yang lain.',
            });
          } else {
            // Validasi apakah penduduk dengan ID sudah terdaftar sebagai user
            this.registerService
              .checkPendudukRegistered(this.user.penduduk.id)
              .subscribe(
                (isRegistered) => {
                  if (isRegistered) {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'User Sudah Terdaftar',
                    });
                  } else {
                    // Lakukan penyimpanan jika semua validasi berhasil
                    this.validate().then(() => this.preSave());
                  }
                },
                (error) => {
                  console.error('Error checking penduduk registration:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'Terjadi kesalahan saat memeriksa registrasi user. Silakan coba lagi.',
                  });
                }
              );
          }
        },
        (error) => {
          console.error('Error checking username availability:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Terjadi kesalahan saat memeriksa ketersediaan username. Silakan coba lagi.',
          });
        }
      );
  }

  preSave(): void {
    const request = {
      // Build your request object based on your form data
      // For example:
      pendudukId: this.user.penduduk.id,
      username: this.user.username,
      password: this.user.password,
    };

    this.registerService.create(request).subscribe((res) => {
      console.log(res.body);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Successful',
      });

      if (res.body) {
        this.router.navigate(['/login']);
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
      noKtp: true,
      pendudukId: true,
      username: true,
      password: true,
    };

    if (!this.user.penduduk.id) {
      this._showNotification('error', 'Masukan No KTP terlebih dahulu');
      mustValidate.pendudukId = false;
    }

    if (!this.user.username) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Username terlebih dahulu');
      mustValidate.username = false;
    }
    if (!this.user.password) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan Password terlebih dahulu');
      mustValidate.password = false;
    }
    if (!this.penduduk.noKtp) {
      // Handle the case when selectedPenduduk is undefined
      this._showNotification('error', 'Masukan No KTP terlebih dahulu');
      mustValidate.noKtp = false;
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
