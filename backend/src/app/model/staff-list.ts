import map from 'lodash-es/map';
import { Pagination } from './pagination';
import { Staff } from './staff';

export class StaffList {
  rows: Staff[];
  pagination: Pagination;

  constructor(values: object = {}) {
    this.rows = [];
    this.pagination = new Pagination();

    Object.assign(this, values);
    this.setRowNum();
  }

  setRowNum() {
    let rowNo = this.pagination.firstRowNo || 0;
    if (this.rows.length > 0) {
      map(this.rows, (row: any) => {
        row.row_num = rowNo--;
        return row;
      });
    }
  }
}
