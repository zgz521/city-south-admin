import { Component, OnInit } from '@angular/core';
import { AddEditComponent } from './add-edit/add-edit.component';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {

  datalist: Array<object>;
  estatelist: Array<object>;
  estateNamse: any = {};
  postlist: Array<object>;
  postNames: any = {};
  category = [];
  isLoading: boolean = false;
  PageSize = 10;
  PageIndex = 1;
  TotalCount: number;
  selectData = {
  };

  search() {
    this.PageIndex = 1;
    this.getlist();
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

  getlist() {
    this.isLoading = true;
    this.employeeService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  addEdit(index?: number): void {
    let title = '新增员工';
    if (index !== undefined) {
      title = '编辑员工“' + this.datalist[index]['EmployeeName'] + '”';
    }
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    var that = this;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: index === undefined ? {} : this.datalist[index],
        estateList: this.estatelist,
        category: this.category,
        postNames: this.postNames
      },
      nzMaskClosable: false,
      nzFooter: null,
      nzWidth: width,
      nzStyle: { position: 'absolute', top: '100px', left: marginLeft }
    });
    modal.afterOpen.subscribe(function () {
      modal.getContentComponent().submitOk.subscribe(function ($event) {
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
      nzContent: '确定要删除此员工信息吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.employeeService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '员工删除成功');
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
        this.estateNamse[item['EstateId']] = item['EstateName'];
      });
    });
  }

  constructor(private modalService: NzModalService, private estateService: EstateService, private employeeService: EmployeeService, private postService: PostService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getCategory();
    this.getlist();
    this.getEstate();
  }

}