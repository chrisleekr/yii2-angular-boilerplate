export class ResponseBody {
  status: number;
  success: boolean;
  data: any;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
