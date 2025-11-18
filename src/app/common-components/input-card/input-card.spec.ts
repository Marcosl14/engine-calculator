import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCard } from './input-card';

describe('InputCard', () => {
  let component: InputCard;
  let fixture: ComponentFixture<InputCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
