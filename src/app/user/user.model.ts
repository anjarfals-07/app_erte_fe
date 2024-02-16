import { IPenduduk, Penduduk } from '../penduduk/penduduk.model';

export interface IUser {
  id?: number;
  username?: string;
  password?: string;
  penduduk?: IPenduduk;
}

export class User implements IUser {
  constructor(
    public id?: number,
    public username?: string,
    public password?: string,
    public penduduk?: IPenduduk
  ) {
    this.penduduk = new Penduduk();
  }
}
