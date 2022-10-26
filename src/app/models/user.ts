import { Customer } from "./customer";
import { Offer } from "./offer";
import { Role } from "./role";

export class User {
  constructor(
    public id?: number | null,
    public name?: string | null,
    public username?: string | null,
    public password?: string | null,
    public customer?: Customer | null,
    public roles?: Role[],
    // public offers?: Offer[]
  ) {}
}
