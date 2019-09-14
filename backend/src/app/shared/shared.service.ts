import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  constructor() {}

  /**
   * Serializes the form element so it can be passed to the back end through the url.
   * The objects properties are the keys and the objects values are the values.
   * ex: { "a":1, "b":2, "c":3 } would look like ?a=1&b=2&c=3
   *
   * @param obj
   * @returns string
   */
  public static serializeQueryString(obj: any): string {
    return Object.keys(obj)
      .map(k => `${k}=${encodeURIComponent(obj[k])}`)
      .join('&');
  }
}
