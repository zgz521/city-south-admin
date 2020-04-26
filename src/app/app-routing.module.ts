import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: 'login', 
    loadChildren: './login/login.module#LoginModule',
  },
  {
    path: 'main', 
    loadChildren: './main/main.module#MainModule',
  },
  {
    path: '', 
    redirectTo: '/main/index', 
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
