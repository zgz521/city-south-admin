import { Injectable, Inject } from '@angular/core';
import { ServiceModule, API_CONFIG } from './service.module';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: ServiceModule
})

export class CarService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist(selectData: any, PageSize: number, PageIndex: number) {
    selectData['PageSize'] = PageSize;
    selectData['PageIndex'] = PageIndex;
    let url = this.uri + '/api/car';
    return this.http.post(url, selectData);
  }

}
