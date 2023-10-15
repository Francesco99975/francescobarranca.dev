// export enum Status {
//   SUBMITTED = "submitted",
//   PENDING = "pending",
//   ACCEPTED = "accepted",
//   INVOICING = "invoicing",
//   COMPLETED = "completed",
// }

import { Status } from "@prisma/client";

export default interface Commission {
  id?: string;
  subject: string;
  description: string;
  theme: string;
  pages: number;
  pwa: boolean;
  environ: string;
  status?: Status;
  price?: number;
  subscription?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
