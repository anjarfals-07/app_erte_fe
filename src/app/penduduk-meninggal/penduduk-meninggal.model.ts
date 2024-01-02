import { IPenduduk, Penduduk } from '../penduduk/penduduk.model';
import {
  ISuratKeteranganMeninggal,
  SuratKeteranganMeninggal,
} from './surat-meninggal.model';

export interface IPendudukMeninggal {
  id?: number;
  kodeMeninggal?: string;
  tanggalWafat?: Date | string;
  penyebab?: string;
  suratKeteranganMeninggal?: ISuratKeteranganMeninggal;
  penduduk?: IPenduduk;
}

export class PendudukMeninggal implements IPendudukMeninggal {
  constructor(
    public id?: number,
    public kodeMeninggal?: string,
    public tanggalWafat?: Date | string,
    public penyebab?: string,
    public suratKeteranganMeninggal?: ISuratKeteranganMeninggal,
    public penduduk?: IPenduduk
  ) {
    this.suratKeteranganMeninggal = new SuratKeteranganMeninggal();
    this.penduduk = new Penduduk();
  }
}
