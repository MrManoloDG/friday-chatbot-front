import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';
import Bullet from 'highcharts/modules/bullet';



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

  public options: any;

  constructor(private elasticService: ElasticsearchService) { }

  ngOnInit() {
    this.options = {

      chart: {
          type: 'boxplot'
      },
      title: {
          text: 'Box Plot'
      },
      legend: {
          enabled: false
      },
      xAxis: {
          categories: ['1', '2', '3', '4', '5'],
          title: {
              text: 'Intervalo de Tiempo'
          }
      },
      yAxis: {
          title: {
              text: 'Observations'
          }
      },
      series: [{
          name: 'Observations',
          data: [
              [760, 801, 848, 895, 965],
              [733, 853, 939, 980, 1080],
              [714, 762, 817, 870, 918],
              [724, 802, 806, 871, 950],
              [834, 836, 864, 882, 910]
          ]
      }]
  };
  Highcharts.chart('container', this.options);
    /*
    if (window.addEventListener) {
      (<any>window).addEventListener("message", this.displayMessage, false);
    } else {
      (<any>window).attachEvent("onmessage", this.displayMessage);
    }
    */

  }

}
