import { GlobalService } from './global.service';
import { environment } from '../../environments/environment';

describe('global.service.ts', () => {
  let globalService: GlobalService;
  let spy: any;

  beforeEach(() => {
    globalService = new GlobalService();
  });

  describe('constructor()', () => {
    it('should set apiHost same as environment value', () => {
      expect(globalService.apiHost).toEqual(environment.apiHost);
    });
  });

  describe('globalService.loadGlobalSettingsFromSessionStorage()', () => {
    it('should not set setting if frontend-setting is not available in session storage', () => {
      sessionStorage.removeItem('frontend-setting');
      globalService.loadGlobalSettingsFromSessionStorage();
      expect(globalService.setting).toEqual({});
    });

    it('should set setting if frontend-setting is not available in session storage', () => {
      const tmpValue: any = {
        setting1: 'temporary setting'
      };
      sessionStorage.setItem('frontend-setting', JSON.stringify(tmpValue));
      globalService.loadGlobalSettingsFromSessionStorage();
      expect(globalService.setting).toEqual(tmpValue);
    });
  });

  describe('GlobalService.getHeaders()', () => {
    it('should return predefined HttpHeaders', () => {
      // Mock function
      const tmpValue = 'temporaryToken12345';
      spy = spyOn(GlobalService, 'getToken').and.returnValue(tmpValue);

      const headers = GlobalService.getHeaders();
      expect(headers.keys()).toEqual(['Content-Type', 'Authorization']);

      expect(headers.get('Content-Type')).toEqual('application/json');
      expect(headers.get('Authorization')).toEqual('Bearer ' + tmpValue);
    });
  });

  describe('GlobalService.getToken()', () => {
    it('should return null if token is not available', () => {
      localStorage.removeItem(environment.tokenName);
      expect(GlobalService.getToken()).toEqual(null);
    });

    it('should return token value if token is available', () => {
      const tmpValue = 'temporaryToken12345';
      localStorage.setItem(environment.tokenName, tmpValue);
      expect(GlobalService.getToken()).toEqual(tmpValue);
    });
  });

  describe('GlobalService.handleError()', () => {});
});
