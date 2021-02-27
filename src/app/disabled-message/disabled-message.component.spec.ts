import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledMessageComponent } from './disabled-message.component';

describe('DisabledMessageComponent', () => {
  let component: DisabledMessageComponent;
  let fixture: ComponentFixture<DisabledMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
