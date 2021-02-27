import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReziActionAppComponent } from './rezi-action-app.component';

describe('ReziActionAppComponent', () => {
  let component: ReziActionAppComponent;
  let fixture: ComponentFixture<ReziActionAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReziActionAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReziActionAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
