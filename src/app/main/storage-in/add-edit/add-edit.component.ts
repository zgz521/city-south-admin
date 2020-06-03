import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { GoodsService } from 'src/app/service/goods.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() data: object;
  @Input() estates: any[];
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  errors: object = {}

  cancel() { this.closed.emit(); }

  handleOk() {
    this.isLoading = true;
    if (this.data['GoodsId'] && this.data['GoodsId'] > 0) {
      this.goodsService.modify(this.data).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '物资信息修改成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    } else {
      this.goodsService.add(this.data).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '物资新增成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  checkValue($event: string, field: string, ignore?: boolean) {
    return this.oprationService.checkValue($event, field, this.errors, ignore);
  }

  constructor(private goodsService: GoodsService, private oprationService: OprationService) { }

  ngOnInit(): void {
  }

}