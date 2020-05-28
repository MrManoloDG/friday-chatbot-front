import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';
import Bullet from 'highcharts/modules/bullet';
import { GraphService } from 'src/app/service/graph.service';



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

  constructor(private elasticService: ElasticsearchService, private graphService: GraphService) { }

  ngOnInit() {
    this.graphService.graphContainers.subscribe((n) => {
      this.setGraphContainers(n);
    });

  }

  setGraphContainers(n: Number) {
    const graph_container = document.getElementById('graphs');
    graph_container.removeChild(document.getElementById('container'));
    for (let i = 0; i < n; i++) {
      const element = document.createElement('div');
      element.setAttribute('id', 'container' + i );
      element.setAttribute('class', 'bullet-container');
      graph_container.appendChild(element);
    }
  }

}
