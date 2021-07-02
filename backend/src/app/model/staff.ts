export class Staff {
  id: number = 0;
  row_num: number = 0;
  username: string = '';
  email: string = '';
  password: string = '';
  role: number = 0;
  role_label: string = '';
  last_login_at: string = '';
  last_login_ip: string = '';
  unconfirmed_email: string = '';
  confirmed_at: string = '';
  blocked_at: string = '';
  status: number = 0;
  status_label: string = '';
  created_at: string = '';
  updated_at: string = '';

  permissions: StaffPermission[] = [];

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class StaffPermission {
  name: string = '';
  description: string = '';
  checked: boolean;

  constructor(values: object = {}) {
    this.name = '';
    this.description = '';
    this.checked = false;

    Object.assign(this, values);
  }
}
