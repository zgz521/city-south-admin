import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class HandHouseService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist(selectData:any, PageSize: number, PageIndex: number) {
    selectData['PageSize'] = PageSize;
    selectData['PageIndex'] = PageIndex;
    let url = this.uri + '/api/handhouse';
    return this.http.post(url, selectData);
  }

  add(data: any){
    let url = this.uri + '/api/handhouse/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/handhouse/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/handhouse/delete/' + id.toString();
    return this.http.delete(url);
  }

}
