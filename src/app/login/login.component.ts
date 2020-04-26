import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == "VALID") {
      var user = this.validateForm.value;
      this.loginService.userLogin(user).subscribe(data => {
        if (data['code'] == 'failed') {
          this.modalService['error']({
            nzMask: false,
            nzTitle: '登录失败',
            nzContent: data['message'].join('<br />')
          })
        }
        else {
          if (user['remember']) {
            window.localStorage['name'] = user['name'];
            window.localStorage['password'] = user['password'];
            window.localStorage['remember'] = user['remember'];
          }
          else {
            if (window.localStorage['name'])
              window.localStorage.removeItem('name')
            if (window.localStorage['password'])
              window.localStorage.removeItem('password')
            if (window.localStorage['remember'])
              window.localStorage.removeItem('remember')
          }
          window.sessionStorage['ticket'] = data['ticket'];
          this.router.navigateByUrl('/main/index')
        }
      });
    }
  }

  constructor(private fb: FormBuilder, private loginService: LoginService, private modalService: NzModalService, private router:Router) { }

  ngOnInit(): void {
    var name = null;
    var password = null;
    var remember = false;
    if (window.localStorage['name'])
      name = window.localStorage['name'];
    if (window.localStorage['password'])
      password = window.localStorage['password'];
    if (window.localStorage['remember'])
      remember = window.localStorage['remember'];
    this.validateForm = this.fb.group({
      name: [name, [Validators.required]],
      password: [password, [Validators.required]],
      remember: [remember]
    });
  }

}
