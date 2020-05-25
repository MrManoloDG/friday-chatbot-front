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

    /*
    if (window.addEventListener) {
      (<any>window).addEventListener("message", this.displayMessage, false);
    } else {
      (<any>window).attachEvent("onmessage", this.displayMessage);
    }
    */

  }

}
