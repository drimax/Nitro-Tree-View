import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('RestApiService', () => {
  let service: RestApiService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let injector: Injector;

  beforeEach(() => {
    injector = TestBed.configureTestingModule({
      imports:
        [HttpClientTestingModule],
      providers:
        [RestApiService]
    });
    service = TestBed.inject(RestApiService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  // afterEach(() => {
  //   httpMock.verify();
  // });

  it('should not immediately connect to the server', () => {
    httpMock.expectNone({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Call 200 ok', () => {
    let posts = [
      {
        "id": 1,
        "location": "San Francisco",
        "time": "1552657573",
        "author": "Happy User",
        "text": "Proper PDF conversion ensures that every element of your document remains just as you left it."
      },
      {
        "id": 2,
        "location": "San Francisco",
        "time": "1552571173",
        "author": "Happy User",
        "text": "The modern workplace is increasingly digital, and workflows are constantly evolving. "
      }];

    service.getPostDetails().subscribe(data => {
      expect(data).toEqual(posts);
    });

    const req = httpMock.expectOne({ method: 'GET', url: 'http://localhost:3000/posts' });
    expect(req.request.method).toEqual("GET");
    httpMock.verify();

  });

  it('Call handleError function ', () => {
    service.getPostDetails().subscribe(() => fail('Calling Post Failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      });

    const req = httpMock.expectOne('http://localhost:3000/posts');
    req.flush('Calling Post Details Failed',
      {
        status: 500,
        statusText: 'Internal server error'
      });
  });

  it('Call handleError function ', () => {
    spyOn(service as any, 'handleError');
    service.getPostDetails().subscribe((res) => {
      console.log(`in success:`, res);
    }, error => {
      console.log(`in error:`, error);
    });

    var error = new ErrorEvent('Post Retrieval Failed');

    const req = httpMock.expectOne('http://localhost:3000/posts');
    req.flush(error)
  });

  it('Call handleError manual ', () => {
    let error = {
      status: 500,
      message: 'Internal server error'
    }
    service.handleError(error);
  });


});
