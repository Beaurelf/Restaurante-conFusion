import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from 'src/shared/baseURL';
import { Feedback } from 'src/shared/feedback';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  

  constructor(private http:HttpClient, private processHttpMsg: ProcessHTTPMsgService) { }

  submitFeedBack(feedback:Feedback):Observable<Feedback>{
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.post<Feedback>(baseURL + 'feedback', feedback, HttpOptions)
    .pipe(catchError(this.processHttpMsg.handleError));
  }
}
