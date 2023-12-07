import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjustePage } from './ajuste.page';

describe('AjustePage', () => {
  let component: AjustePage;
  let fixture: ComponentFixture<AjustePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AjustePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
