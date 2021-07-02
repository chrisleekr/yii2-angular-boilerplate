export class ResponseBody {
  status: number;
  success: boolean;
  data: any;

  constructor(values: object = {}) {
    this.status = 0;
    this.success = false;
    this.data = {};
    Object.assign(this, values);
  }
}
