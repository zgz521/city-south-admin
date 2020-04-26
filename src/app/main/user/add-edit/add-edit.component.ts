import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() data: object;
  @Output() closed = new EventEmitter();
  @Output() roles: Array<object>;
  @Output() estates: Array<object>;
  validateForm: FormGroup;
  isVerfyPassword = false;
  passwordVisible = false;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == "VALID") {
      var data = this.validateForm.value;
      data['RoleIds'] = data['Roles'].filter(function(item:any){return item['checked']}).map(function (item: any) { return item['value'] });
      data['EstateIds'] = data['Estates'].filter(function(item:any){return item['checked']}).map(function (item: any) { return item['value'] });
      data['UserId'] = this.data['UserId'];
      if (this.data['UserId']) {
        //修改
        this.userService.modify(data).subscribe(result => {
          this.oprationService.tips(result, '用户修改成功');
          if (result['code'] == 'success')
            this.closed.emit();
        });
      }
      else {
        //新增
        this.userService.add(data).subscribe(result => {
          this.oprationService.tips(result, '新增用户成功');
          if (result['code'] == 'success')
            this.closed.emit();
        });
      }
    }
  }

  constructor(private fb: FormBuilder, private userService: UserService, private oprationService: OprationService) { }

  ngOnInit(): void {
    let passwordValidators = [];
    if (!this.data['UserId']){
      passwordValidators.push(Validators.required);
      this.isVerfyPassword = true;
    }
    this.validateForm = this.fb.group({
      LoginName: [this.data['LoginName'], [Validators.required]],
      Password: [null, passwordValidators],
      UserName: [this.data['UserName'], [Validators.required]],
      Sex: [this.data['Sex'], [Validators.required]],
      Phone: [this.data['Phone'], [Validators.pattern(/^1\d{10}$/)]],
      Email: [this.data['Email'], [Validators.email]],
      Roles: [this.roles, []],
      Estates: [this.estates, []],
    });
  }

}
