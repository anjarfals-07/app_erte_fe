import { IPenduduk, Penduduk } from '../penduduk/penduduk.model';

export interface ISuratPengantar {
  id?: number;
  noSuratPengantar?: string;
  tanggalSurat?: Date | string;
  keterangan?: string;
  keperluan?: string;
  penduduk?: IPenduduk;
}

export class SuratPengantar implements ISuratPengantar {
  constructor(
    public id?: number,
    public noSuratPengantar?: string,
    public tanggalSurat?: Date | string,
    public keterangan?: string,
    public keperluan?: string,
    public penduduk?: IPenduduk
  ) {
    this.penduduk = new Penduduk();
  }
}
