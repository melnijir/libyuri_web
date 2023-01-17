import { TestBed } from '@angular/core/testing';

import { YuriService } from './yuri.service';

describe('YuriService', () => {
  let service: YuriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YuriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
