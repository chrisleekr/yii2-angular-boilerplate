export class Staff {
  id: number;
  row_num: number;
  username: string;
  email: string;
  password: string;
  role: number;
  role_label: string;
  last_login_at: string;
  last_login_ip: string;
  confirmed_at: string;
  blocked_at: string;
  status: number;
  status_label: string;
  created_at: string;
  updated_at: string;

  permissions: StaffPermission[];

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class StaffPermission {
  name: string;
  description: string;
  checked: boolean;
}
