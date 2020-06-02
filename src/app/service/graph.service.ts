import { Injectable } from '@angular/core';
import { ElasticsearchService } from '../services/elasticsearch.service';
import * as Highcharts from 'highcharts';
import Bullet from 'highcharts/modules/bullet';
import { DialogflowService } from './dialogflow.service';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { formatDate, DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GraphService {


  messageSource = new ReplaySubject<string>(1);
  graphContainers = new ReplaySubject<Number>(1);
  pipe = new DatePipe('es-ES');

  private options: any;
  constructor(private elasticService: ElasticsearchService, private dialogflowService: DialogflowService) { }


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
      case 'scatter_plot':
        this.drawScatterPlot(colname, params);
        break;
      case 'box_plot':
        this.drawBoxPlot(colname, params);
        break;
      case 'slope_graph':
        this.drawSlopeChart(colname, params);
        break;
      case 'heatmap':
        this.drawHeatMap(colname, params);
        break;
      case 'line_graph':
        this.drawLineGraph(colname, params);
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
    this.elasticService.getBulletGraphData(colname, params.groupField).then((res) => {
      let values = [];
      this.graphContainers.next(res.length);
      res.map(e => {
        values.push(e.avg.value);
      });
      console.log(values);
      console.log(params);

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
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        this.options =  {
          chart: {
              marginTop: 40
          },
          title: {
              text: colname
          },
          xAxis: {
              categories: ['<span class="hc-cat-title">' + element.key + '</span>']
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
                  y: element.avg.value,
                  target: Number(params.target)
              }]
          }],
          tooltip: {
              pointFormat: '<b>{point.y}</b> (with target at {point.target})'
          }
      };
      Highcharts.chart('container' + index, this.options);
      }
    });
  }

  drawScatterPlot(colname: string[], params: any) {
    this.elasticService.getTwoColname(colname).then((res) => {
      let data = [];

      res.map(e => {
        data.push([e._source[colname[0]], e._source[colname[1]]]);
      });

      this.options = {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Scatter Plot'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            title: {
                enabled: true,
                text: colname[0]
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: colname[1]
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} , {point.y} '
                }
            }
        },
        series: [{
            name: 'Point',
            color: 'rgba(223, 83, 83, .5)',
            data: data
        }]
    };
      Highcharts.chart('container', this.options);
    });
  }

  drawBoxPlot(colname: string, params: any) {
    this.elasticService.getBoxPlotTime(colname, params.IntervalTime, params['date-period'], params.timeField).then((res) => {
      console.log("dibujando box plot");
      console.log(res);

      let title_time = [];
      let data = [];

      res.map( e => {
        title_time.push(new Date(e.key).toLocaleDateString());
        data.push([
          e.min.value,
          e.percentiles.values['25.0'],
          e.percentiles.values['50.0'],
          e.percentiles.values['75.0'],
          e.max.value
        ]);
      });

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
            categories: title_time,
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
            data: data
        }]
    };
    Highcharts.chart('container', this.options);
    });
  }

  drawSlopeChart(colname: string, params: any) {
    this.elasticService.getSlopeGraph(colname, params['date-period'], params.timeField).then((res) => {
      if (res.length <= 0) {
        // Check no params in query
        this.messageSource.next('Lo siento, no hay datos en ese intervalo');
      } else {
        let dates = params['date-period'].split('/');
        let ini = res[0]._source[colname];
        let fin = res[res.length - 1]._source[colname];
        console.log(res);
        this.options = {
            chart: {
                renderTo: 'container',
                defaultSeriesType: 'line',
                marginTop: 100
            },
            title: {
                text: 'Slope Graph'
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return this.series.name + ' ' + this.y;
                }
            },
            xAxis: {
                opposite: true,
                lineColor: '#999',
                categories: [dates[0], dates[1]],
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        fontWeight: 'bold'
                    }
                }
            },
            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false,
                },
                title: {
                    text: '',
              }
            },
            plotOptions: {
                line: {
                    lineWidth: 2,
                    shadow: false,
                    color: '#666',
                    marker: {
                        radius: 2,
                        symbol: 'circle'
                    },
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        x: 10,
                        y: 0
                    }
                },
                scatter: {
                    shadow: false,
                    color: '#666',
                    marker: {
                        radius: 2
                    },
                    dataLabels: {
                        enabled: true,
                        align: 'right',
                        x: -10,
                        y: 0,
                        formatter: function() {
                            return this.point.name + ' ' + this.y;
                        }
                    }
                }
            },
            series: [{
                name: colname,
                data: [ini, fin]
            }, {
                type: 'scatter',
                data: [{'x': 0, 'y': fin, 'name': colname}]
              }]
          };
        Highcharts.chart('container', this.options);
      }

    });
  }


  drawHeatMap(colname: string[], params: any) {
    this.elasticService.getHeatMapData(colname, params.valueField).then((res) => {
      let data = [];
      let xAxis = [];
      let yAxis = [];

      res.xaxis.map(e => {
        xAxis.push(e.key);
      });

      res.yaxis.map(e => {
        yAxis.push(e.key);
      });

      res.data.map(e => {
        let x = xAxis.indexOf(e.key);
        e['2'].buckets.map( agg2 => {
          let y = yAxis.indexOf(agg2.key);
          data.push([x, y, agg2['1'].value]);
        });
      });

      this.options = {

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },
        title: {
            text: 'Sales per employee per weekday'
        },
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            categories: yAxis,
            title: null,
            reversed: true
        },
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
        series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: data,
            dataLabels: {
                enabled: true,
                color: '#000000'
            }
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    yAxis: {
                        labels: {
                            formatter: function () {
                                return this.value.charAt(0);
                            }
                        }
                    }
                }
            }]
        }
    };
      Highcharts.chart('container', this.options);
    });
  }

  drawLineGraph(colname: string, params: any) {
    this.elasticService.getSlopeGraph(colname, params['date-period'], params.timeField).then((res) => {
      if (res.length <= 0) {
        // Check no params in query
        this.messageSource.next('Lo siento, no hay datos en ese intervalo');
      } else {
        let data = [];
        let xAxis = [];
        res.map(e => {
          data.push(e._source[colname]);
          const timefield = new Date().setTime(e._source[params.timeField]);
          xAxis.push(this.pipe.transform(timefield, 'shortDate'));
        });
        console.log(res);
        this.options = {
            title: {
                text: 'Line Graph'
            },
            subtitle: {
                text: ''
            },
            yAxis: {
                title: {
                    text: colname
                }
            },
            xAxis: {
                categories: xAxis
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            series: [{
                name: colname,
                data: data
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        };
        Highcharts.chart('container', this.options);
      }

    });
  }
}
