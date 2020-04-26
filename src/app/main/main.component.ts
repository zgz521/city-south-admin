import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { UserService } from '../service/user.service';
import { PasswordComponent } from './user/password/password.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})

export class MainComponent implements OnInit {
  menuIndex: number = 0;
  menus = [{ name: '首页', link: '/main/index', icon: 'home', children: [] }];
  loginname = '';

  changeMenu(no: number) {
    this.menuIndex = no;
    if (this.menus[no]['link'] === 'child')
      this.router.navigateByUrl(this.menus[no]['children'][0]['link']);
    else
      this.router.navigateByUrl(this.menus[no]['link']);
  }

  loginout(): void {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要退出系统？',
      nzClosable: false,
      nzOnOk: () => {
        window.sessionStorage.clear();
        this.router.navigateByUrl('/login');
      }
    });
  }

  getMenus() {
    let curUrl = this.router.url;
    this.userService.getMenus().subscribe(result => {
      window.sessionStorage['authors'] = result['authors'];
      this.menus = this.menus.concat(result['menus']);
      for (let i = 0; i < this.menus.length; i++) {
        if (curUrl == this.menus[i]['link']) {
          this.menuIndex = i;
          break;
        }
        let isFind = false;
        for (let j = 0; j < this.menus[i]['children'].length; j++) {
          if (curUrl == this.menus[i]['children'][j].link) {
            this.menuIndex = i;
            isFind = true;
            break;
          }
        }
        if (isFind)
          break;
      }
      if (this.menuIndex == 0 && curUrl != '/main/index') {
        this.router.navigateByUrl('/main/index');
      }
    });
  }

  changePassword() {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    const modal = this.modalService.create({
      nzTitle: '修改密码',
      nzContent: PasswordComponent,
      nzComponentParams: {
      },
      nzMaskClosable: false,
      nzFooter: null,
      nzWidth: width,
      nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
    });
    modal.afterOpen.subscribe(function () {
      modal.getContentComponent().closed.subscribe(function () {
        modal.close();
      });
    });
  }
  constructor(private router: Router, private userService: UserService, private modalService: NzModalService) { }

  ngOnInit() {
    this.getMenus();
    this.loginname = window.localStorage['name'];
  }

}
