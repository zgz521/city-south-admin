import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})
export class WorkPlanService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getlist(selectData:any) {
    let url = this.uri + '/api/workplan';
    return this.http.post(url, selectData);
  }

  set(data: any){
    let url = this.uri + '/api/workplan/set';
    return this.http.post(url, data);
  }

}