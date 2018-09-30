import _ from 'lodash';
import {Staff} from './staff';
import {Pagination} from './pagination';

export class StaffList {
    rows: Staff[];
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
