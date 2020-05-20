import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OutputGraphComponent } from './components/output-graph/output-graph.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import Bullet from 'highcharts/modules/bullet';
Bullet(Highcharts);

@NgModule({
  declarations: [
    AppComponent,
    OutputGraphComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
