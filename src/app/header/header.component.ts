import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public sidebarComponent : SidebarComponent){
    console.log('footer component');
  }

  public onAppMenuClick(){
    this.sidebarComponent.sidebarShow = true;
  }

}
