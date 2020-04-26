import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OprationService } from 'src/app/service/opration.service';
import { OwnerService } from 'src/app/service/owner.service';
import { CostConfigService } from 'src/app/service/cost-config.service';
import { WaterElectricityService } from 'src/app/service/water-electricity.service';
import { ElseCostService } from 'src/app/service/else-cost.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {

  @Input() data: object;
  @Input() costNames: Array<string>;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  errors: object = {
    voucher: false,
    receipt: false
  }

  checkValue($event: string, field: string) {
    let isVerfy = false;
    if (field === 'receipt')
      isVerfy = /^\d{7}$/.test($event);
    else if (field === 'voucher')
      isVerfy = /^\d{6}$/.test($event);
    this.errors[field] = !isVerfy;
    console.log(isVerfy);
    return isVerfy;
  }

  cancel() { this.closed.emit(); }

  handleOk() {
    let isVerfy = this.checkValue(this.data['elseCost']['ReceiptNo'], 'receipt') 
    && this.checkValue(this.data['elseCost']['VoucherNo'], 'voucher');
    if (isVerfy && this.data['elseCost']['Status'] > -1) {
      this.isLoading = true;
      this.data['elseCost']['Status'] = this.data['IsPay'] ? 1 : 0;
      this.elseCostService.modify(this.data['elseCost']).subscribe(result => {
        this.isLoading = false;
        this.oprationService.tips(result, '繳費修改成功');
        if (result['code'] == 'success')
          this.submitOk.emit();
      });
    }
  }

  constructor(private ownerService: OwnerService, private elseCostService: ElseCostService, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.data['IsPay'] = this.data['elseCost']['Status'] == 1;
  }

}