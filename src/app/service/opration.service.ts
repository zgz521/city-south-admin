import { Injectable, Inject } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ServiceModule, API_CONFIG } from './service.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: ServiceModule
})

export class OprationService {

  constructor(private modalService: NzModalService, private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  tips(result: any, message?: string) {
    if (result['code'] == 'success') {
      if (message) {
        this.modalService.success({
          nzTitle: '信息提示',
          nzContent: message,
          nzClosable: false
        });
      }
    }
    else {
      this.modalService.error({
        nzTitle: '操作失败',
        nzContent: result['message'].join('<br />'),
        nzClosable: false
      });
    }
  }

  formatDate(date: Date) {
    let y = date.getFullYear().toString();
    let m = (date.getMonth() + 1).toString();
    let d = date.getDate().toString();
    m = m[1] ? m : ('0' + m);
    d = d[1] ? d : ('0' + d);
    return [y, m, d].join('-');
  }
  dateDiff(interval: string, startDate: Date, endDate: Date) {
    let result = null;
    if (interval === 'MM') {
      let y1 = startDate.getFullYear();
      let y2 = endDate.getFullYear();
      let m1 = startDate.getMonth();
      let m2 = endDate.getMonth();
      result = ((y2 - y1) * 12 + m2) - m1;
    }
    return result;
  }

  checkCardId(val: string) {
    if (/^(\d{14}|\d{17})[0-9Xx]$/.test(val)) {
      let Ai = val.length == 18 ? val.substring(0, 17) : val.substring(0, 6) + '19' + val.substring(6, 15);
      let yyyy = parseInt(Ai.substring(6, 10));
      let mm = parseInt(Ai.substring(10, 12));
      let dd = parseInt(Ai.substring(12, 14));
      if (yyyy % 4 == 0) {
        if (!/^[1-9][0-9]{5}[0-9]{4}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/.test(Ai))
          return false;
      }
      else {
        if (!/^[1-9][0-9]{5}[0-9]{4}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/.test(Ai))
          return false;
      }
      let birthday = new Date([yyyy, mm, dd].join('-'));
      let now = new Date();
      if (birthday.getTime() > now.getTime() || now.getFullYear() - yyyy > 100)
        return false;
      //开始检查校验位
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(val[i]) * factor[i];
      }
      let code = Ai + parity[sum % 11];
      return code === val.toUpperCase();
    }
    else {
      return false;
    }
  }

  checkValue(val: string, field: string, errors: any, ignore?: boolean) {
    let isVerfy = false;
    if (ignore && val === '') { isVerfy = true; }
    else {
      if (field === 'phone')
        isVerfy = /^\d{11}$/.test(val);
      else if (field === 'phone2')
        isVerfy = /^\d{11}$/.test(val);
      else if (field === 'tel')
        isVerfy = /^\d{4,8}$/.test(val);
      else if (field === 'cardid')
        isVerfy = this.checkCardId(val);
    }
    errors[field] = !isVerfy;
    return isVerfy;
  }

  download(path: string, data: any, cb: any) {
    this.http.post(`${this.uri}${path}`, data, { responseType: 'blob', observe: 'response' }).subscribe(res => {
      cb();
      let blob = new Blob([res.body], { type: "application/octet-stream" });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', objectUrl);
      a.setAttribute('download', decodeURI(res.headers.get('content-disposition').split('filename=')[1]));
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

}
