export class User {
  id: number = 0;
  username: string = '';
  email: string = '';
  password: string = '';
  last_login_at: string = '';
  last_login_ip: string = '';
  confirmed_at: string = '';
  blocked_at: string = '';
  status: number = 0;
  status_label: string = '';
  created_at: string = '';
  updated_at = '';

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
