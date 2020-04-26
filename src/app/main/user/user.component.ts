import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { AddEditComponent } from './add-edit/add-edit.component';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  datalist: Array<object>;
  sourcedatalist: Array<object>;
  isLoading: boolean = true;
  searchText = '';

  getlist() {
    this.userService.getlist().subscribe(result => {
      this.isLoading = false;
      this.sourcedatalist = result['datalist'];
      this.datalist = result['datalist'];
    });
  }

  search() {
    if (this.searchText == ''){
      this.datalist = this.sourcedatalist;
    }
    else {
      let searchText = this.searchText;
      this.datalist = this.sourcedatalist.filter(function (item: any) {
        return item['LoginName'].indexOf(searchText) > -1 ||
          item['UserName'].indexOf(searchText) > -1 ||
          item['Phone'].indexOf(searchText) > -1;
      });
    }
  }

  addEdit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let title = '新增系统用户';
    let UserId = 0;
    if (index > -1) {
      data = this.datalist[index];
      UserId = this.datalist[index]['UserId'];
      title = '编辑用户“' + this.datalist[index]['LoginName'] + '”';
    }
    var that = this;
    this.isLoading = true;
    this.userService.getRoles(UserId).subscribe(result => {
      that.userService.getEstates(UserId).subscribe(estateResult => {
        let roles = result['roles'].map(function (item: any) {
          return {
            label: item['RoleName'],
            value: item['RoleId'],
            checked: item['Checked']
          }
        });
        //estate
        let estates = estateResult['estates'].map(function (item: any) {
          return {
            label: item['EstateName'],
            value: item['EstateId'],
            checked: item['Checked']
          }
        });
        that.isLoading = false;
        const modal = this.modalService.create({
          nzTitle: title,
          nzContent: AddEditComponent,
          nzComponentParams: {
            data: data,
            roles: roles,
            estates: estates
          },
          nzMaskClosable: false,
          nzFooter: null,
          nzWidth: width,
          nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
        });
        modal.afterOpen.subscribe(function () {
          modal.getContentComponent().closed.subscribe(function () {
            modal.close();
            that.getlist();
          });
        });
      });
    });
  }

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要删除此用户吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.userService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '用户删除成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  constructor(private modalService: NzModalService, private userService: UserService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getlist();
  }

}