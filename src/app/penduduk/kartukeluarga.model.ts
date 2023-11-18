export interface IKartuKeluarga {
  id?: number;
  noKK?: string; // Provide a default value
  namaKepalaKeluarga?: string;
}

export class KartuKeluarga implements IKartuKeluarga {
  constructor(
    public id?: number,
    public noKK?: string,
    public namaKepalaKeluarga?: string
  ) {}
}
