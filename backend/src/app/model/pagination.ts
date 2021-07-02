export class Pagination {
  pageParam: string | null;
  pageSizeParam: string | null;
  params: any | null;
  totalCount: number | null;
  defaultPageSize: number | null;
  pageSizeLimit: any | null;
  firstRowNo: number | null;

  constructor(values: object = {}) {
    this.pageParam = null;
    this.pageSizeParam = null;
    this.params = null;
    this.totalCount = null;
    this.defaultPageSize = null;
    this.pageSizeLimit = null;
    this.firstRowNo = null;

    Object.assign(this, values);
  }
}
