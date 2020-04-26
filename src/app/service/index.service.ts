import { Injectable, Inject } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServiceModule
})

export class IndexService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getFirmCount(): Observable<number> {
    let url = this.uri + '/api/main/page/count'
    return this.http.post(url, {}).pipe(map((res: { count: number }) => res.count));
  }

  getPlantBaseCount(): Observable<number> {
    let url = this.uri + '/api/planting/page/count'
    return this.http.post(url, {}).pipe(map((res: { count: number }) => res.count));
  }

  getCurriculumVitaeCount(): Observable<number> {
    let url = this.uri + '/api/data/page/count'
    return this.http.post(url, {}).pipe(map((res: { count: number }) => res.count));
  }

  getInputCount(): Observable<number> {
    let url = this.uri + '/api/breeds/page/count'
    return this.http.post(url, {}).pipe(map((res: { count: number }) => res.count));
  }

  getUnVerifyFirm2PlantBase() {
    let url = this.uri + '/api/report/mainAndPlanting/page/5,1';
    return this.http.post(url, {'gtype': 'run'});
  }

  getUnInputFirm() {
    let url = this.uri + '/api/planting/isNotSend/page/10,1';
    return this.http.post(url, {});
  }

  getArea() {
    let url = this.uri + '/api/main/group/dq';
    return this.http.post(url, {});
  }

  getGuizhou(){
    return this.http.get('assets/json/520000_full.json');
  }
}
