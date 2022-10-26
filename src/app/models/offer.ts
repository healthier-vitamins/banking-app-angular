import { Customer } from "./customer";

export class Offer {
  constructor(
    public offerId?: number | null,
    public offerName?: string | null,
    public loanAmnt?: number | null,
    public interestRatePercent?: number | null,
    public interestFreeCashWithdrawal?: number | null,
    public annualFee?: number | null,
    public preclosureCharges?: number | null,
    public custId?: number | null
  ) { }
}
