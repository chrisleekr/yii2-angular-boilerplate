export class ResponseBody {
  status: number;
  success: boolean;
  data: any;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
