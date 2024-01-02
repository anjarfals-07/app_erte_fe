export interface ISuratKeteranganMeninggal {
  id?: number;
  noSuratMeninggal?: string;
  tanggalSuratMeninggal?: Date | string;
  keteranganSuratMeninggal?: string;
}

export class SuratKeteranganMeninggal implements ISuratKeteranganMeninggal {
  constructor(
    public id?: number,
    public noSuratMeninggal?: string,
    public tanggalSuratMeninggal?: Date | string,
    public keteranganSuratMeninggal?: string
  ) {}
}
