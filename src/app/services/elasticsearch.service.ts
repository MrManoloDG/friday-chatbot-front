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

  async searchByOneColName(colname: string) {
    
    return this.client.search({
      index: 'covid_canada',
      body: {
        _source: [colname],
        query: {
          match_all: {}
        }
      }
    }).then(function(resp) {
      console.log("Successful query!");
      console.log(JSON.stringify(resp, null, 4));
      return resp.hits.hits;
    }, function(err) {
      console.trace(err.message);
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
                order : { _key : "asc"}
              }
          }
      }
      }
    }).then(function(resp) {
      console.log("Successful query!");
      console.log(JSON.stringify(resp, null, 4));
      return resp.aggregations.colname.buckets;
    }, function(err) {
      console.trace(err.message);
    });
  }
}
