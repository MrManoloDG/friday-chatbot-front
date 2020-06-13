import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ElasticsearchService } from 'src/app/services/elasticsearch.service';
import Bullet from 'highcharts/modules/bullet';
import { GraphService } from 'src/app/service/graph.service';
import * as $ from 'jquery';



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

  public options: string;
  public hiddenGraph: boolean;

  constructor(private elasticService: ElasticsearchService, private graphService: GraphService) { }

  ngOnInit() {
    this.hiddenGraph = false;
    this.graphService.graphContainerOption.subscribe((option) => {
      this.options = option;
      if (option === 'table') {
        $('#container').css('height', '65%');
      }
    });
    this.graphService.graphContainers.subscribe((n) => {
      this.setGraphContainers(n);
    });
    this.graphService.graphShow.subscribe((show) => {
      this.hiddenGraph = show;
    })

  }

  setGraphContainers(n: Number) {
    const graph_container = $('#graphs');
    graph_container.empty();
    for (let i = 0; i < n; i++) {
      const id_element = 'container' + i;
      if (this.options === 'bullet') {
        graph_container.append(`<div id='${id_element}' class='bullet-container'></div>`);
      } else {
        graph_container.append(`<div id='${id_element}' class='container-graph'></div>`);
      }
    }
  }

  checkDisabled(id: string) {
    if (document.querySelector(id).childElementCount < 1) {
      return true;
    } else {
      return false;
    }
  }

}
