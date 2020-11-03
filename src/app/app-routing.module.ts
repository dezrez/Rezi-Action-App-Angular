import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReziActionAppWrapperComponent } from './rezi-action-app-wrapper.component'

const routes: Routes = [{
  path: './',
  component: ReziActionAppWrapperComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
