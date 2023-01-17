import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesListComponent } from './components/classes-list/classes-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NodesListComponent } from './components/nodes-list/nodes-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
