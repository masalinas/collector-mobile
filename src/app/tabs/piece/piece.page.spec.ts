import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PiecePage } from './piece.page';

describe('PiecePage', () => {
  let component: PiecePage;
  let fixture: ComponentFixture<PiecePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PiecePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PiecePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
