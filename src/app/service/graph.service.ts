import { Injectable } from '@angular/core';
import { ElasticsearchService } from '../services/elasticsearch.service';
import * as Highcharts from 'highcharts';
import Bullet from 'highcharts/modules/bullet';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private options: any;
  constructor(private elasticService: ElasticsearchService) { }

  draw(graph: string, colname: any, params: any) {
    switch (graph) {
      case 'histogram':
        this.drawHistogram(colname);
        break;
      case 'frequency_polygon':
        this.drawFrequencyPolygon(colname);
        break;
      case 'bullet_graph':
        this.drawBulletGraph(colname, params);
        break;

    }
  }

  drawHistogram(colname: string) {
    console.log("Drawing a histogram");
    console.log(colname);
    this.elasticService.getHistogram(colname).then((res) => {
      let categories = [];
      let data = [];
      res.map(e => {
        categories.push(e.key);
        data.push(e.doc_count);
      });

      console.log("Successfull query!");
      console.log(res);
      this.options = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Histogram'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        series: [{
          name: colname,
          data: data
        }]
      };

      Highcharts.chart('container', this.options);
    });
  }

  drawFrequencyPolygon(colname: string) {
    console.log("Drawing a Frequency Polygon");
    console.log(colname);
    this.elasticService.getHistogram(colname).then((res) => {
      let categories = [];
      let data = [];
      res.map(e => {
        categories.push(e.key);
        data.push(e.doc_count);
      });

      console.log("Successfull query!");
      console.log(res);
      this.options = {
        title: {
          text: 'Frequency Polygon'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        plotOptions: {
          series: {
              label: {
                  connectorAllowed: false
              },
              pointStart: 2010
          }
        },
        series: [{
          name: colname,
          data: data
        }]
      };

      Highcharts.chart('container', this.options);
    });
  }

  drawBulletGraph(colname: string, params: any) {
    this.elasticService.getLastByOneColName(colname).then((res) => {
      let values = [];
      res.map(e => {
        values.push(e._source[colname]);
      });
      console.log(values);
      console.log(params);
      let max = Math.max.apply(null, values);


      console.log("Successfull query!");
      Highcharts.setOptions({
      chart: {
              inverted: true,
              marginLeft: 135,
              type: 'bullet'
          },
          title: {
              text: null
          },
          legend: {
              enabled: false
          },
          yAxis: {
              gridLineWidth: 0
          },
          plotOptions: {
            series: {
                borderWidth: 0,
                color: '#000',
            }
        },
          credits: {
              enabled: false
          },
          exporting: {
              enabled: false
          }
      });
      this.options =  {
          chart: {
              marginTop: 40
          },
          title: {
              text: '2017 YTD'
          },
          xAxis: {
              categories: ['<span class="hc-cat-title">' + colname + '</span>']
          },
          yAxis: {
              plotBands: [{
                  from: Number(params.bad1),
                  to: Number(params.bad2),
                  color: '#666'
              }, {
                  from: Number(params.avg1),
                  to: Number(params.avg2),
                  color: '#999'
              }, {
                  from: Number(params.good1),
                  to: Number(params.good2),
                  color: '#bbb'
              }],
              title: null
          },
          series: [{
              data: [{
                  y: values[0],
                  target: Number(params.target)
              }]
          }],
          tooltip: {
              pointFormat: '<b>{point.y}</b> (with target at {point.target})'
          }
      };
      Highcharts.chart('container', this.options);
    });
  }
}
