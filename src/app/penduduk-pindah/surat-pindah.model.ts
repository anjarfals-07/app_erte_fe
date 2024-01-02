export interface ISuratPindah {
  id?: number;
  noSuratPindah?: string;
  tanggalSuratPindah?: Date | string;
  keteranganPindah?: string;
}

export class SuratPindah implements ISuratPindah {
  constructor(
    public id?: number,
    public noSuratPindah?: string,
    public tanggalSuratPindah?: Date | string,
    public keteranganPindah?: string
  ) {}
}
