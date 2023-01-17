import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesListComponent } from './classes-list.component';

describe('ClassesListComponent', () => {
  let component: ClassesListComponent;
  let fixture: ComponentFixture<ClassesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
