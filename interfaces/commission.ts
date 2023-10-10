export default interface Commission {
  id?: string;
  subject: string;
  description: string;
  theme: string;
  pages: number;
  pwa: boolean;
  static: boolean;
  environ: string;
  accepted?: boolean;
  completed?: boolean;
  price?: number;
  subscription?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
