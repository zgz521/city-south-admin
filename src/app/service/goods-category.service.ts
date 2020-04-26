import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class GoodsCategoryService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }


  getlist() {
    let url = this.uri + '/api/category';
    return this.http.get(url);
  }

  add(data: any){
    let url = this.uri + '/api/category/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/category/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/category/delete/' + id.toString();
    return this.http.delete(url);
  }

}
