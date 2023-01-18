import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NodesListComponent } from './components/nodes-list/nodes-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClassesListComponent } from './components/classes-list/classes-list.component';
import { GraphComponent } from './components/graph/graph.component';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    NodesListComponent,
    DashboardComponent,
    ClassesListComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
