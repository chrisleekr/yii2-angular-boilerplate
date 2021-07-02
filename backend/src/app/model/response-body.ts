export class ResponseBody {
  status: number | null;
  success: boolean | null;
  data: any | null;

  constructor(values: object = {}) {
    this.status = null;
    this.success = null;
    this.data = null;

    Object.assign(this, values);
  }
}
