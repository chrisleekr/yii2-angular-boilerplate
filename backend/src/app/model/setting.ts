export class Setting {
  id: number = 0;
  meta_key: string = '';
  meta_name: string = '';
  meta_type: string = '';
  meta_desc: string = '';
  meta_attribute: any = '';
  meta_value: string = '';
  is_public: number = 0;
  created_at: string = '';
  updated_at: string = '';

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
