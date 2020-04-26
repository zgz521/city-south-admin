import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OprationService } from 'src/app/service/opration.service';
import { CostConfigService } from 'src/app/service/cost-config.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() data: object;
  @Output() closed = new EventEmitter();
  @Output() estateList: Array<object>;
  configTypeList = [
    { key: 'property', name: '物业费' },
    { key: 'parking', name: '停车费' },
    { key: 'water', name: '水费' },
    { key: 'electricity', name: '电费' }
  ];
  discountUnit = {
    cash: '元',
    cashMultiple: '元',
    time: '个月',
    timeMultiple: '个月'
  };
  isDiscount = false;
  discountMode = '';
  validateForm: FormGroup;
  divHeight = (window.innerHeight - 303) + 'px';

  changeConfigType($event) {
    this.isDiscount = 'propertyparking'.indexOf($event) > -1;
  }
  changeDiscountMode($event) {
    this.discountMode = $event;
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == "VALID") {
      var data = this.validateForm.value;
      data['Category'] = this.configTypeList.find(function (item: any) { return item.key == data['ConfigType'] }).name;
      if (this.data['ConfigId'] && this.data['ConfigId'] > 0) {
        //修改
        data['ConfigId'] = this.data['ConfigId'];
        this.costConfigService.modify(data).subscribe(result => {
          this.oprationService.tips(result, '配置修改成功');
          if (result['code'] == 'success')
            this.closed.emit();
        });
      }
      else {
        //新增
        this.costConfigService.add(data).subscribe(result => {
          this.oprationService.tips(result, '新增配置成功');
          if (result['code'] == 'success')
            this.closed.emit();
        });
      }
    }
  }

  constructor(private fb: FormBuilder, private costConfigService: CostConfigService, private oprationService: OprationService) { }

  ngOnInit(): void {
    if (this.data['ConfigType'])
      this.isDiscount = 'propertyparking'.indexOf(this.data['ConfigType']) > -1;
    this.validateForm = this.fb.group({
      EstateId: [this.data['EstateId'], [Validators.required]],
      ConfigType: [this.data['ConfigType'], [Validators.required]],
      ConfigVersion: [this.data['ConfigVersion'], [Validators.required]],
      UnitPrice: [this.data['UnitPrice'], [Validators.required, Validators.pattern(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/)]],
      UnitName: [this.data['UnitName'], [Validators.required]],
      IsDefault: [this.data['IsDefault']],
      IsAble: [this.data['IsAble']],
      DiscountMode: [this.data['DiscountMode']],
      Quantity: [this.data['Quantity']],
      Amount: [this.data['Amount']],
      Remark: [this.data['Remark']]
    });
  }

}