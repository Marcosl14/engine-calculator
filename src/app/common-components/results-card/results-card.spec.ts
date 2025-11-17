import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsCard } from './results-card';

describe('ResultsCard', () => {
  let component: ResultsCard;
  let fixture: ComponentFixture<ResultsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
