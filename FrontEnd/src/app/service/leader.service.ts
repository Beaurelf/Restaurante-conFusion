import { Injectable } from '@angular/core';
import { Leader } from 'src/shared/leader';
import { Observable } from 'rxjs';
import {catchError, delay, map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from 'src/shared/baseURL';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  leader: Leader;

  constructor(private http:HttpClient, private processHttpMsg: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(err=>this.processHttpMsg.handleError(err)));
  }

  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
    .pipe(catchError(err=>this.processHttpMsg.handleError(err)))
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]))
    .pipe(catchError(err=>this.processHttpMsg.handleError(err)))
  }
}
