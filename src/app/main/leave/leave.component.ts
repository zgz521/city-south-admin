import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { LeaveService } from 'src/app/service/leave.service';
import { AddEditComponent } from './add-edit/add-edit.component';
import { PostService } from 'src/app/service/post.service';
import { NzModalService, UploadChangeParam, NzMessageService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { ServiceModule, API_CONFIG } from 'src/app/service/service.module';

@Injectable({
  providedIn: ServiceModule
})

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.less']
})
export class LeaveComponent implements OnInit {

  datalist: Array<object>;
  estatelist: Array<object>;
  postlist: Array<object>;
  typeNames: Array<string>;
  postNames: any = {};
  estateNames: any = {};
  category = [];
  isLoading: boolean = false;
  PageSize = 10;
  PageIndex = 1;
  TotalCount: number;
  selectData = {
    KeyWord: '',
    FkId: null
  };

  search() {
    this.PageIndex = 1;
    this.getlist();
  }

  getlist() {
    this.isLoading = true;
    this.leaveService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  getTypeNames() {
    this.leaveService.getGroup().subscribe(result => {
      this.typeNames = result['groups'];
    });
  }

  generateCategory(parent: any) {
    let parentId = 0;
    if (parent)
      parentId = parent['key'];
    let list = this.postlist.filter(function (item) { return item['ParentPostId'] === parentId });
    if (list.length > 0) {
      if (parent)
        parent['children'] = [];
      for (let i = 0; i < list.length; i++) {
        let node = { key: list[i]['PostId'], title: list[i]['PostName'], postType: list[i]['PostType'], parent: parent }
        this.generateCategory(node);
        if (parent)
          parent['children'].push(node);
        else
          this.category.push(node);
      }
    }
    else if (parent) {
      parent['isLeaf'] = true;
      let items = [];
      let node = parent;
      items.push(node['title']);
      while (node['parent']) {
        node = node['parent']
        items.push(node['title']);
      }
      let name = {};
      this.postNames[parent['key']] = items.reverse().join(' / ');
    }
  }

  getCategory() {
    this.postService.getlist().subscribe(result => {
      this.postlist = result['datalist'];
      this.category = [];
      this.generateCategory(null);
    });
  }

  addEdit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let title = '新增假条';
    let employeeName = '';
    if (index > -1) {
      data = this.datalist[index]['leave'];
      employeeName = this.datalist[index]['EmployeeName'];
      title = '编辑“' + this.datalist[index]['EmployeeName'] + '”的假条';
    }
    var that = this;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: data,
        employeeName: employeeName,
        category: this.category,
        postNames: this.postNames,
        estateNames: this.estateNames,
        estateList: this.estatelist
      },
      nzMaskClosable: false,
      nzFooter: null,
      nzWidth: width,
      nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
    });
    modal.afterOpen.subscribe(function () {
      modal.getContentComponent().submitOk.subscribe(function () {
        modal.close();
        that.getlist();
      });
      modal.getContentComponent().closed.subscribe(function () {
        modal.close();
      });
    });
  }

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要作废此假条吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.leaveService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '假条作废成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  getEstate() {
    this.estateService.select().subscribe(result => {
      this.estatelist = result['datalist'];
      this.estatelist.splice(0, 0, {EstateId: 0, EstateName: '总公司'});
      this.estatelist.forEach(item => {
        this.estateNames[item['EstateId']] = item['EstateName'];
      });
    });
  }

  export() {
    this.isLoading = true;
    this.oprationService.download('/api/leave/export', this.selectData, function () {
      this.isLoading = false;
    })
  }

  constructor(private modalService: NzModalService, private estateService: EstateService, private leaveService: LeaveService, private oprationService: OprationService, private postService: PostService) { }

  ngOnInit() {
    this.getlist();
    this.getCategory();
    this.getTypeNames();
    this.getEstate();
  }

}
