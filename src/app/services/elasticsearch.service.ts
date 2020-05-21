import { Injectable } from '@angular/core';
import * as elasticsearch from 'elasticsearch-browser';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  async getByOneColName(colname: string) {
    return this.client.search({
      index: 'covid_canada',
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

  async getLastByOneColName(colname: string) {
    return this.client.search({
      index: 'covid_canada',
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


  async getHistogram(colname: string) {
    return this.client.search({
      index: 'covid_canada',
      body: {
        aggs : {
          colname : {
              terms : {
                field : colname,
                order : { _key : 'asc'}
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


  async getTwoColname(colnames: string[]) {
    return this.client.search({
      index: 'covid_canada',
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

  async getBoxPlotTime(colname: string, period: string) {
    return this.client.search({
      index: 'covid_canada',
      body: {
        '_source': [colname, 'date'],
        'size': 10000,
        'aggs' : {
            'overtime' : {
                'date_histogram' : {
                    'field' : 'date',
                    'calendar_interval' : this.IntervalTime[period],
                    'order': {
                      '_key': 'desc'
                    }
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
                  },
                  'size': {
                      'bucket_sort': {
                          'sort': [],
                          'size': 10
                      }
                  }
                }
            }
        }
      }
    }).then(function(resp) {
      console.log('Successful query!');
      console.log(JSON.stringify(resp, null, 4));
      return resp.aggregations.overtime.buckets;
    }, function(err) {
      console.log(err.message);
    });
  }

}
