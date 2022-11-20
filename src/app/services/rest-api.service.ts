import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {PostData} from '../treeview/treeview.component'

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private httpClient : HttpClient) { }

    apiURL = 'http://localhost:3000';
    // Http Options
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    //calling post details
    getPostDetails(): Observable<PostData[]> {
      return this.httpClient
        .get<PostData[]>(this.apiURL + '/posts')
        .pipe(retry(1), catchError(this.handleError));
    }

    // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
