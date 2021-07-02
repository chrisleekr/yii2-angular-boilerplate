export class User {
  id: number = 0;
  row_num: number = 0;
  username: string = '';
  email: string = '';
  password: string = '';
  last_login_at: string = '';
  last_login_ip: string = '';
  unconfirmed_email: string = '';
  confirmed_at: string = '';
  blocked_at: string = '';
  status: number = 10;
  status_label: string = '';
  created_at: string = '';
  updated_at: string = '';

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
