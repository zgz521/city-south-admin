import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CustomInterceptorModule implements HttpInterceptor {

  constructor(private router: Router, private modalService: NzModalService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    let ticket = window.sessionStorage['ticket'];
    let options = {};
    if (ticket)
      options['setHeaders'] = { 'Authorization': 'BasicAuth ' + ticket }
    const modified = req.clone(options);
    return next.handle(modified).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            if (event.status >= 500) {
              // 跳转错误页面
            }
          }
        },
        error => {
          if (error.status == 401) {
            let res = error.error;
            if (res['code'] == 'notlogin')
              this.router.navigateByUrl('/login');
            else {
              this.modalService.warning({
                nzTitle: '操作失败',
                nzContent: res['message'].join('<br />'),
                nzClosable: false
              });
            }
          }
        })
    );
  }
}
