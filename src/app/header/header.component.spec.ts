import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent],
      imports: [MatToolbarModule, MatIconModule],
      providers: [SidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Check App Menu Onclick', fakeAsync(() => {
    spyOn(component, 'onAppMenuClick');
  
    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    tick();
    expect(component.onAppMenuClick).toHaveBeenCalled();
  
  }));

  it('Check App Menu HTML Click', () => {
    const btn = fixture.debugElement.query(By.css('.btn')).nativeElement;
    btn.click();
    expect(component.sidebarComponent.sidebarShow).toBe(true);
  
  });
});
