export interface IDetailPendudukPindah {
  id?: number;
  kodePindah?: string;
  noKK?: string;
  noKTP?: string;
  nama?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  agama?: string;
  pendudukPindahId?: number;
  pendudukId?: number;
  fotoUrl?: string;
}

export class DetailPendudukPindah implements IDetailPendudukPindah {
  constructor(
    public id?: number,
    public kodePindah?: string,
    public noKK?: string,
    public noKTP?: string,
    public nama?: string,
    public jenisKelamin?: string,
    public tempatLahir?: string,
    public tanggalLahir?: Date,
    public agama?: string,
    public pendudukPindahId?: number,
    public pendudukId?: number,
    public fotoUrl?: string
  ) {}
}
