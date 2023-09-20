import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterfazChoferPage } from './interfaz-chofer.page';

describe('InterfazChoferPage', () => {
  let component: InterfazChoferPage;
  let fixture: ComponentFixture<InterfazChoferPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InterfazChoferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
