import {
  IKartuKeluarga,
  KartuKeluarga,
} from '../kartu-keluarga/kartukeluarga.model';

export interface IPenduduk {
  id?: number;
  noKtp?: string;
  kartuKeluarga?: IKartuKeluarga;
  namaLengkap?: string;
  tanggallahir?: Date | string;
  tempatLahir?: string;
  jenisKelamin?: string;
  statusKeluarga?: string;
  statusPerkawinan?: string;
  agama?: string;
  pendidikan?: string;
  pekerjaan?: string;
  telepon?: string;
  email?: string;
  alamat?: string;
  rt?: string;
  rw?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  kodePos?: string;
  foto?: File | null;
  fotoUrl?: string;
  statusPenduduk?: string;
  newStatusPenduduk?: string;
}

export class Penduduk implements IPenduduk {
  constructor(
    public id?: number,
    public noKtp?: string,
    public kartuKeluarga?: IKartuKeluarga,
    public namaLengkap?: string,
    public tanggallahir?: Date | string,
    public tempatLahir?: string,
    public jenisKelamin?: string,
    public statusKeluarga?: string,
    public statusPerkawinan?: string,
    public agama?: string,
    public pendidikan?: string,
    public pekerjaan?: string,
    public telepon?: string,
    public email?: string,
    public alamat?: string,
    public rt?: string,
    public rw?: string,
    public kelurahan?: string,
    public kecamatan?: string,
    public kota?: string,
    public kodePos?: string,
    public foto?: File | null,
    public fotoUrl?: string,
    public statusPenduduk?: string,
    public newStatusPenduduk?: string
  ) {
    this.kartuKeluarga = new KartuKeluarga();
  }
}
