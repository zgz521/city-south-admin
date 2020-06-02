import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { NzInputDirective, NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';
import { EstateService } from 'src/app/service/estate.service';
import { IntroductComponent } from './introduct/introduct.component';

@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.less']
})
export class EstateComponent implements OnInit {
  editIndex: number = -1;
  colIndex: number = -1;
  datalist: Array<object>;
  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editIndex > -1 && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editRow();
      this.editIndex = -1;
      this.colIndex = -1;
    }
  }

  editRow() {
    this.estateService.modify(this.datalist[this.editIndex]).subscribe(result => {
      this.oprationService.tips(result);
    });
  }

  addRow(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    let data = { EstateName: '新建小区' };
    this.estateService.add(data).subscribe(result => {
      if (result['code'] == 'success') {
        this.getList();
      }
    });
  }

  editIntroduct(data: any): void {
    let width = window.innerWidth - 200;
    if (width > 800)
      width = 800;
    let marginLeft = ((window.innerWidth - width) / 2) + 'px';
    const modal = this.modalService.create({
      nzTitle: '编辑“' + data['EstateName'] + '”的简介',
      nzContent: IntroductComponent,
      nzComponentParams: {
        data: data
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

  getList() {
    this.estateService.getlist().subscribe(result => {
      this.datalist = result['datalist'];
    });
  }

  deleteRow(id: number): void {
    this.estateService.delete(id).subscribe(result => {
      this.oprationService.tips(result, '小区删除成功');
      if (result['code'] == 'success') {
        this.datalist = this.datalist.filter(d => d['EstateId'] !== id);
      }
    })
  }

  startEdit(index: number, colIndex: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.editIndex > -1 && this.editIndex !== index) {
      this.editRow();
    }
    this.editIndex = index;
    this.colIndex = colIndex;
  }

  constructor(private estateService: EstateService, private oprationService: OprationService, private modalService: NzModalService) { }

  ngOnInit(): void {
    this.getList();
  }

}
