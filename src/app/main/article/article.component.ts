import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/service/article.service';
import { AddEditComponent } from './add-edit/add-edit.component';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements OnInit {

  datalist: any[] | null = null;
  estatelist: any[] | null = null;
  isLoading: boolean = false;
  PageSize = 10;
  PageIndex = 1;
  TotalCount: number;
  selectData = {
    KeyWord: ''
  };

  search() {
    this.PageIndex = 1;
    this.getlist();
  }

  changeShow(id: number, isShow: boolean) {
    let data = { 'ArticleId': id, 'IsShow': isShow };
    this.articleService.changeShow(data).subscribe(result => { });
  }

  setEstateNames() {
    if (this.estatelist && this.datalist) {
      for (let i = 0; i < this.datalist.length; i++) {
        let EstateIds = this.datalist[i]['EstateIds'].replace(/^(\s|,)+|(\s|,)+$/g, '').split(',').map(Number);
        let EstateNames = [];
        this.estatelist.forEach(item => {
          EstateIds.forEach(id => {
            if (item['EstateId'] === id)
              EstateNames.push(item['EstateName']);
          });
        })
        this.datalist[i]['EstateNames'] = EstateNames.join(',');
      }
    }
  }

  getlist() {
    this.isLoading = true;
    this.articleService.getlist(this.selectData, this.PageSize, this.PageIndex).subscribe(result => {
      this.isLoading = false;
      this.TotalCount = result['count'];
      this.datalist = result['datalist'];
      if (this.estatelist)
        this.setEstateNames();
    });
  }

  getEstate() {
    this.estateService.select().subscribe(result => {
      this.estatelist = result['datalist'];
      if (this.datalist)
        this.setEstateNames();
    });
  }

  addEdit(index: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let title = '添加公告';
    if (index > -1) {
      data = this.datalist[index];
      title = '编辑公告“' + this.datalist[index]['Title'] + '”';
    }
    var that = this;
    that.isLoading = false;
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: data,
        estatelist: this.estatelist
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
      nzContent: '确定要删除此房屋吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.articleService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '房屋删除成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  constructor(private modalService: NzModalService, private articleService: ArticleService, private estateService: EstateService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getEstate();
    this.getlist();
  }

}