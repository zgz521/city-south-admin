import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HouseService } from 'src/app/service/house.service';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() estateList: Array<object>;
  @Input() data: object = {
    HouseId: null,
    EstateId: null,
    HouseType: null,
    Building: null,
    Unit: null,
    Floor: null,
    No: null,
    HouseNo: null,
    Model: null,
    Structure: null,
    Floorage: null,
    ContactTel: null,
    ElsetTel: null,
    News: null,
    IsPlace: null,
    HandDate: null,
    EmptyState: null,
    Remark: null
  };
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  isLoading = false;
  errors: object = {
    phone: false,
    tel: false
  }

  cancel() { this.closed.emit(); }

  handleOk() {
    let isVerfy = this.checkValue(this.data['ContactTel'], 'phone') && this.checkValue(this.data['ElseTel'], 'tel');
    if (isVerfy) {
      this.isLoading = true;
      if (this.data['HouseId'] && this.data['HouseId'] > 0) {
        this.houseService.modify(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '房屋修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      } else {
        this.houseService.add(this.data).subscribe(result => {
          this.isLoading = false;
          this.oprationService.tips(result, '新增房屋成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
    }
  }

  changeHouseNo() {
    let HouseNo = '';
    if (this.data['Building'] != undefined && this.data['Building'] !== '')
      HouseNo += '-' + this.data['Building'];
    if (this.data['Unit'] != undefined && this.data['Unit'] !== '')
      HouseNo += '-' + this.data['Unit'];
    if (this.data['Floor'] != undefined && this.data['Floor'] !== '')
      HouseNo += '-' + this.data['Floor'];
    if (this.data['No'] != undefined && this.data['No'] !== '')
      HouseNo += '-' + this.data['No'];
    if (HouseNo.length > 0)
      HouseNo = HouseNo.substring(1);
    this.data['HouseNo'] = HouseNo;
  }

  checkValue($event: string, field: string) {
    let isVerfy = false;
    if (field === 'phone')
      isVerfy = /^\d{11}$/.test($event);
    else if (field === 'tel')
      isVerfy = !$event || $event === '' || /^\d{4,8}$/.test($event);
    this.errors[field] = !isVerfy;
    return isVerfy;
  }

  constructor(private houseService: HouseService, private oprationService: OprationService) { }

  ngOnInit(): void {
  }

}
