import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReziActionAppWrapperComponent } from './rezi-action-app-wrapper.component';

describe('ReziActionAppWrapperComponent', () => {
  let component: ReziActionAppWrapperComponent;
  let fixture: ComponentFixture<ReziActionAppWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReziActionAppWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReziActionAppWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
