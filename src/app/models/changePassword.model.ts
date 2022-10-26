export class changePasswordModel {
  constructor(
    public username?: string | null,
    public newPassword?: string | null,
    public oldPassword?: string | null
  ) {}
}
