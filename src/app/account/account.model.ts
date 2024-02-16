export interface Account {
  id: number;
  username: string;
  pendudukId?: number;
  role: string;
  token: string;
  expiresInMs: number;
  namaLengkap: string;
  fotoUrl: string;
  email: string;
}
