import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {provide: API_CONFIG, useValue: 'http://localhost:9020'}//http://localhost:9020,29267,http://47.115.11.48:9020
  ]
})
export class ServiceModule { }