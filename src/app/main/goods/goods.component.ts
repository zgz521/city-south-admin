import { Component, OnInit } from '@angular/core';
import { AddEditComponent } from './add-edit/add-edit.component';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { GoodsService } from 'src/app/service/goods.service';
import { GoodsCategoryService } from 'src/app/service/goods-category.service';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.less']
})
export class GoodsComponent implements OnInit {

  datalist: Array<object>;
  categorylist: Array<object>;
  categoryNames: any = {};
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
    let list = this.categorylist.filter(function (item) { return item['ParentCategoryId'] === parentId });
    if (list.length > 0) {
      if (parent)
        parent['children'] = [];
      for (let i = 0; i < list.length; i++) {
        let node = { key: list[i]['CategoryId'], title: list[i]['CategoryName'], parent: parent }
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
      this.categoryNames[parent['key']] = items.reverse().join(' / ');
    }
  }

  getCategory() {
    this.goodsCategoryService.getlist().subscribe(result => {
      this.categorylist = result['datalist'];
      console.log(this.categorylist);
      this.category = [];
      this.generateCategory(null);
    });
  }

  getlist() {
    this.isLoading = true;
    this.goodsService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
    });
  }

  addEdit(index?: number): void {
    let title = '新增物资';
    if (index !== undefined) {
      title = '编辑物资“' + this.datalist[index]['GoodsName'] + '”';
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
        category: this.category,
        categoryNames: this.categoryNames
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
      nzContent: '确定要删除此物资信息吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.goodsService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '物资删除成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  constructor(private modalService: NzModalService, private goodsService: GoodsService, private goodsCategoryService: GoodsCategoryService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getCategory();
    this.getlist();
  }

}
