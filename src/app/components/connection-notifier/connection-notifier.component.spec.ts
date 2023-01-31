import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionNotifierComponent } from './connection-notifier.component';

describe('ConnectionNotifierComponent', () => {
  let component: ConnectionNotifierComponent;
  let fixture: ComponentFixture<ConnectionNotifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionNotifierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
