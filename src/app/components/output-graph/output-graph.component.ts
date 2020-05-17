import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {

  public options: any = {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Fruit Consumption'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
    },
    yAxis: {
        title: {
            text: 'Fruit eaten'
        }
    },
    series: [{
        name: 'Jane',
        data: [1, 0, 4]
    }, {
        name: 'John',
        data: [5, 7, 3]
    }]
  };

  constructor() { }

  ngOnInit() {
    Highcharts.chart('container', this.options);
    /*
    if (window.addEventListener) {
      (<any>window).addEventListener("message", this.displayMessage, false);
    } else {
      (<any>window).attachEvent("onmessage", this.displayMessage);
    }
    */

  }

  
  public displayMessage (evt) {
    // $('.imagepreview').attr('src', evt.data);
    // $('#imagemodal').modal('show');
    alert("Polla");
  }

}
