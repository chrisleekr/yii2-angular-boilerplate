import _ from 'lodash';
import { User } from './user';
import { Pagination } from './pagination';

export class UserList {
  rows: User[];
  pagination: Pagination;

  constructor(values: Object = {}) {
    Object.assign(this, values);
    this.setRowNum();
  }

  setRowNum() {
    let rowNo = this.pagination.firstRowNo || 0;
    if (this.rows.length > 0) {
      _.map(this.rows, row => {
        row.row_num = rowNo--;
        return row;
      });
    }
  }
}
