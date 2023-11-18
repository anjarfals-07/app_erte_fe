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
}
