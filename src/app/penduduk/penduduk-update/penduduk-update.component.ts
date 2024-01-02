import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IPenduduk, Penduduk } from '../penduduk.model';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PendudukService } from '../penduduk.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import * as lodash from 'lodash';

@Component({
  selector: 'app-penduduk-update',
  templateUrl: './penduduk-update.component.html',
  styleUrls: ['../penduduk-create/penduduk-create.component.css'],
})
export class PendudukUpdateComponent {
  // penduduk: Penduduk;
  penduduk: IPenduduk = new Penduduk();
  id: number;

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

  constructor(
    private pendudukService: PendudukService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.id = this.route.snapshot.params['id'];
    this.loadPenduduk();
  }

  loadPenduduk() {
    this.pendudukService.getById(this.id).subscribe((data) => {
      this.penduduk = data;
    });
  }

  // getPendudukById(id: number): void {
  //   this.pendudukService.getById(id).subscribe((data) => {
  //     this.penduduk = data;
  //   });
  // }

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

  updatePenduduk() {
    if (this.selectedFile) {
      this.penduduk.foto = this.selectedFile;
    }

    if (this.penduduk.tanggallahir instanceof Date) {
      this.penduduk.tanggallahir = this.formatDate(this.penduduk.tanggallahir);
    }

    this.pendudukService
      .updatePenduduk(this.id, this.penduduk)
      .subscribe((res) => {
        console.log(res.body);

        if (res.body) {
          this.router.navigate(['/penduduk']);
        }
      });
  }

  // Method untuk menghandle perubahan pada input file (foto)
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      // this.penduduk.fotoUrl = '';

      // Display the selected photo preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.selectedFileUrl = reader.result;
      };
      console.log('read', file);
    }
  }
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
