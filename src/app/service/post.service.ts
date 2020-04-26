import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class PostService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }


  getlist() {
    let url = this.uri + '/api/post';
    return this.http.get(url);
  }

  add(data: any){
    let url = this.uri + '/api/post/add';
    return this.http.post(url, data);
  }

  modify(data: any){
    let url = this.uri + '/api/post/modify';
    return this.http.put(url, data);
  }

  delete(id: number){
    let url = this.uri + '/api/post/delete/' + id.toString();
    return this.http.delete(url);
  }

}
