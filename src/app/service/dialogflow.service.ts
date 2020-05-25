import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ApiAiClient } from 'api-ai-javascript';
import { environment } from 'src/environments/environment';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {
  private baseUrl = 'https://api.dialogflow.com/v1/query?v=20150910';
  private token = environment.token;
  readonly _client = new ApiAiClient({accessToken: this.token});


  constructor(private http: Http) {
  }


  getResponseFromAgent(payload) {
    return this._client.textRequest(payload);
  }
}
