import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesListComponent } from './nodes-list.component';

describe('NodesListComponent', () => {
  let component: NodesListComponent;
  let fixture: ComponentFixture<NodesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
