import { Injectable } from '@angular/core';
import * as elasticsearch from 'elasticsearch-browser';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { time } from 'highcharts';

const httpOptions = {
  headers: new HttpHeaders({
    'access-control-allow-origin': '*',
    'content-type': 'application/json; charset=UTF-8',
    'content-length': '326'
 })
};

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  private IntervalTime = {
    'meses': 'month',
    'años': 'year',
    'horas': 'hour',
    'dias': 'day',
    'minutos': 'minute'
  }

  private client: elasticsearch.Client;

  private connect() {
    this.client = new elasticsearch.Client({
      host: environment.elasticURI,
      log: 'trace'
    });
  }

  constructor(private http: HttpClient) {
    this.connect();
  }

  ping() {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello JavaSampleApproach!'
    });
  }

  async getAllFields(fields: string[], index: string) {
    return this.client.search({
      index: index,
      body: {
        _source: fields,
        size: 10000,
        query: {
          match_all: {}
        }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.hits.hits;
    }, function(err) {
      console.log(err.message);
    });
  }

  async getByOneColName(colname: string, index: string) {
    return this.client.search({
      index: index,
      body: {
        _source: [colname],
        size: 10000,
        query: {
          match_all: {}
        }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.hits.hits;
    }, function(err) {
      console.log(err.message);
    });
  }

  async getLastByOneColName(colname: string, index: string) {
    return this.client.search({
      index: index,
      body: {
        _source: [colname],
        size: 1,
        query: {
          match_all: {}
        },
        sort: [
          {
            '@timestamp': {
              'order': 'asc'
            }
          }
        ]
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.hits.hits;
    }, function(err) {
      console.log(err.message);
    });
  }

  async getBulletGraphData(colname: string, groupCol: string, index: string) {
    return this.client.search({
      index: index,
      body: {
        size: 10000,
        'aggs': {
          'bullet': {
            'terms': {
              'field': groupCol,
              'size': 10000
            },
            'aggs': {
              'avg': {
                'avg': {
                  'field': colname
                }
              }
            }
          }
        }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.aggregations.bullet.buckets;
    }, function(err) {
      console.log(err.message);
    });
  }


  async getHistogram(colname: string, index: string) {
    return this.client.search({
      index: index,
      body: {
        size: 10000,
        aggs : {
          colname : {
              terms : {
                field : colname,
                order : { _key : 'asc'},
                size: 10000
              },
              aggs: {
                'size': {
                  'bucket_sort': {
                      'sort': [],
                      'size': 10000
                  }
                }
              }
          }
      }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.aggregations.colname.buckets;
    }, function(err) {
      console.log(err.message);
    });
  }


  async getTwoColname(colnames: string[], index: string) {
    return this.client.search({
      index: index,
      body: {
        _source: [colnames[0], colnames[1]],
        size: 10000,
        query: {
          match_all: {}
        }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.hits.hits;
    }, function(err) {
      console.log(err.message);
    });
  }

  async getBoxPlotTime(colname: string, period: string, interval: string, timeField: string, index: string) {
    const dates = interval.split('/');
    const body = {
      '_source': [colname, timeField],
      'size': 10000,
      'query': {
        'range' : {
        }
      },
      'aggs' : {
          'overtime' : {
              'date_histogram' : {
                  'field' : timeField,
                  'calendar_interval' : this.IntervalTime[period]
              },
              'aggs': {
                'min': {
                  'min': {
                    'field': colname
                  }
                },
                'max': {
                  'max': {
                    'field': colname
                  }
                },
                'avg': {
                  'avg': {
                    'field': colname
                  }
                },
                'percentiles': {
                  'percentiles': {
                    'field': colname,
                    'percents': [
                      25,
                      50,
                      75
                    ]
                  }
                }
              }
          }
      }
    };

    body.query.range[timeField] = {
      'gte' : new Date(dates[0]).getTime(),
      'lte' : new Date(dates[1]).getTime(),
      'format': 'epoch_millis'
    };
    return this.client.search({
      index: index,
      body: body
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.aggregations.overtime.buckets;
    }, function(err) {
      console.log(err.message);
    });
  }

  getSlopeGraph(colname: string, interval: string, timeField: string, index: string) {
    let dates = interval.split('/');
    console.log(dates);
    let body = {
      '_source': [colname, timeField, '@timestamp'],
      'size': 10000,
      'query': {
          'range' : {
          }
      },
      sort: [
      ]
    };

    body.query.range[timeField] = {
        'gte' : new Date(dates[0]).getTime(),
        'lte' : new Date(dates[1]).getTime(),
        'format': 'epoch_millis'
    };

    let sort = {};
    sort[timeField] = {
      'order': 'asc'
    };
    body.sort.push(sort);
    return this.client.search({
      index: index,
      body: body
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.hits.hits;
    }, function(err) {
      console.log(err.message);
    });
  }


  async getHeatMapData(colname: string[], value: string, index: string) {
    return this.client.search({
      index: index,
      body: {
        size: 10000,
        'aggs': {
          'heatmap': {
            'terms': {
              'field': colname[0],
              'order': {
                '_key': 'asc'
              },
              'size': 10000
            },
            'aggs': {
              '2': {
                'terms': {
                  'field': colname[1],
                  'order': {
                    '_key': 'asc'
                  },
                  'size': 10000
                },
                'aggs': {
                  '1': {
                    'avg': {
                      'field': value
                    }
                  }
                }
              }
            }
          },
          'xvalues': {
            'terms': {
              'field': colname[0],
              'order': {
                    '_key': 'asc'
              },
              'size': 10000
            }
          },
          'yvalues': {
            'terms': {
              'field': colname[1],
              'order': {
                    '_key': 'asc'
              },
              'size': 10000
            }
          }
        }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return {
        data: resp.aggregations.heatmap.buckets,
        xaxis: resp.aggregations.xvalues.buckets,
        yaxis: resp.aggregations.yvalues.buckets
      };
    }, function(err) {
      console.log(err.message);
    });
  }


  async getVarianceGraphData(colname: string[], index: string) {
    return this.client.search({
      index: index,
      body: {
        size: 10000,
        'aggs': {
          'heatmap': {
            'terms': {
              'field': colname[1],
              'order': {
                '_key': 'asc'
              },
              'size': 10000
            },
            'aggs': {
              '2': {
                'terms': {
                  'field': colname[0],
                  'order': {
                    '_key': 'asc'
                  },
                  'size': 10000
                }
              }
            }
          },
          'xvalues': {
            'terms': {
              'field': colname[1],
              'order': {
                    '_key': 'asc'
              },
              'size': 10000
            }
          },
          'yvalues': {
            'terms': {
              'field': colname[0],
              'order': {
                    '_key': 'asc'
              },
              'size': 10000
            }
          }
        }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return {
        total: resp.hits.total.value,
        data: resp.aggregations.heatmap.buckets,
        xaxis: resp.aggregations.xvalues.buckets,
        yaxis: resp.aggregations.yvalues.buckets
      };
    }, function(err) {
      console.log(err.message);
    });
  }
}
