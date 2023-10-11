import Commission from "./commission";

export interface Customer {
  email: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  address: string;
  commissions?: Commission[];
}
