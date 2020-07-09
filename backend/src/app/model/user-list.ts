import _ from 'lodash';
import { Pagination } from './pagination';
import { User } from './user';

export class UserList {
  rows: User[];
  pagination: Pagination;

  constructor(values: object = {}) {
    Object.assign(this, values);
    this.setRowNum();
  }

  setRowNum() {
    let rowNo = this.pagination.firstRowNo || 0;
    if (this.rows.length > 0) {
      _.map(this.rows, (row: any) => {
        row.row_num = rowNo--;
        return row;
      });
    }
  }
}
