import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AuthorService } from 'src/app/service/author.service';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.less']
})
export class AuthorComponent implements OnInit {

  datalist: Array<object>;
  isLoading: boolean = true;

  getlist() {
    this.authorService.getlist().subscribe(result => {
      this.isLoading = false;
      this.datalist = result['datalist'];
    });
  }

  addEdit(index: number, childIndex: number) {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    let data = {};
    let title = '新增顶级系统资源';
    let parentAuthorId = 0;
    if (childIndex == -2 && index > -1) {
      parentAuthorId = this.datalist[index]['AuthorId'];
      title = '新增系统资源，上级资源名称“' + this.datalist[index]['AuthorName'] + '”';
    }
    else if (childIndex == -1 && index > -1) {
      parentAuthorId = -1;
      data = this.datalist[index];
      title = '编辑资源“' + this.datalist[index]['AuthorName'] + '”';
    }
    else if (childIndex > -1 && index > -1) {
      parentAuthorId = -1;
      data = this.datalist[index]['children'][childIndex];
      title = '编辑资源“' + this.datalist[index]['AuthorName'] + ' - ' + this.datalist[index]['children'][childIndex]['AuthorName'] + '”';
    }
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: AddEditComponent,
      nzComponentParams: {
        data: data,
        parentAuthorId: parentAuthorId
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

  delete(id: number) {
    this.modalService.confirm({
      nzTitle: '信息提示',
      nzContent: '确定要删除此条资源吗？',
      nzClosable: false,
      nzOnOk: () => {
        this.authorService.delete(id).subscribe(result => {
          this.oprationService.tips(result, '资源删除成功');
          if (result['code'] == 'success')
            this.getlist();
        });
      }
    });
  }

  constructor(private modalService: NzModalService, private authorService: AuthorService, private oprationService: OprationService) { }

  ngOnInit() {
    this.getlist();
  }

}
