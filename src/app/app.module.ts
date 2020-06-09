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
import Heatmap from 'highcharts/modules/heatmap';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import {DataTablesModule} from 'angular-datatables';

registerLocaleData(localeEs, 'es-ES');

Bullet(Highcharts);
Heatmap(Highcharts);
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
    DataTablesModule,
    ChartModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] } // add as factory to your providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
