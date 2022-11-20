import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeviewComponent } from './treeview/treeview.component';

const routes: Routes = [
  { path: '', component: TreeviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
