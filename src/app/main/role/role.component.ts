import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddEditComponent } from './add-edit/add-edit.component';
import { RoleService } from 'src/app/service/role.service';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {

  datalist: Array<object>;
  sourcedatalist: Array<object>;
  isLoading: boolean = true;

  getlist() {
    this.roleService.getlist().subscribe(result => {
      this.isLoading = false;
      this.sourcedatalist = result['datalist'];
      this.datalist = result['datalist'];
    });
  }

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要删除此角色吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.roleService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '角色删除成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  addEdit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let title = '新增系统用户';
    if (index > -1) {
      data = this.datalist[index];
      title = '编辑用户“' + this.datalist[index]['LoginName'] + '”';
    }
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: data
      },
      nzMaskClosable: false,
      nzFooter: null,
      nzWidth: width,
      nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
    });
    var that = this;
    modal.afterOpen.subscribe(function () {
      modal.getContentComponent().closed.subscribe(function () {
        modal.close();
        that.getlist();
      });
    });
  }

  constructor(private modalService: NzModalService, private roleService: RoleService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getlist();
  }

}
