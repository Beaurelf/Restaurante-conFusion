import { Injectable } from '@angular/core';
import { Promotion } from 'src/shared/promotion';
import { of, Observable } from 'rxjs';
import {catchError, delay, map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from 'src/shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  
  constructor(private http: HttpClient, private processHttpMsg: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(err=>this.processHttpMsg.handleError(err)))
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/'+ id)
    .pipe(catchError(err=>this.processHttpMsg.handleError(err)))
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions?featured=true').pipe(map(promotions => promotions[0]))
    .pipe(catchError(err=>this.processHttpMsg.handleError(err)))
  }
}
