import {
  IKartuKeluarga,
  KartuKeluarga,
} from '../kartu-keluarga/kartukeluarga.model';
import { ISuratPindah, SuratPindah } from './surat-pindah.model';

export interface IPendudukPindah {
  id?: number;
  kodePindah?: string;
  tanggalPindah?: Date | string;
  alamatPindah?: string;
  suratKeteranganPindah?: ISuratPindah;
}

export class PendudukPindah implements IPendudukPindah {
  constructor(
    public id?: number,
    public kodePindah?: string,
    public tanggalPindah?: Date | string,
    public alamatPindah?: string,
    public suratKeteranganPindah?: ISuratPindah
  ) {
    this.suratKeteranganPindah = new SuratPindah();
  }
}
