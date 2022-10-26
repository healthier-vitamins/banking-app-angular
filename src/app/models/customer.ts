import { BankAccount } from './bank-account';
import { Offer } from './offer';

export class Customer {
  constructor(
    public custId?: number | null,
    public custFirstName?: string | null,
    public custLastName?: string | null,
    public custCity?: string | null, 
    public custPhone?: string | null,
    public bankAcc?: BankAccount | null,
    public offers?: Offer[] 
  ) {}
}
