import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthorService } from 'src/app/service/author.service';
import { NzModalService } from 'ng-zorro-antd';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() data: object;
  @Input() parentAuthorId: number;
  @Output() closed = new EventEmitter();

  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == "VALID") {
      var data = this.validateForm.value;
      console.log(this.parentAuthorId);
      if (this.parentAuthorId == -1) {
        //修改
        data['AuthorId'] = this.data['AuthorId'];
        data['ParentAuthorId'] = this.data['ParentAuthorId'];
        this.authorServie.modify(data).subscribe(result => {
          this.oprationService.tips(result, '资源修改成功');
          if (result['code'] == 'success')
            this.closed.emit();
        });
      }
      else {
        //新增
        data['ParentAuthorId'] = this.parentAuthorId;
        this.authorServie.add(data).subscribe(result => {
          this.oprationService.tips(result, '新增资源成功');
          if (result['code'] == 'success')
            this.closed.emit();
        });
      }
    }
  }
  constructor(private fb: FormBuilder, private authorServie: AuthorService, private oprationService: OprationService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      AuthorName: [this.data['AuthorName'], [Validators.required]],
      MenuLink: [this.data['MenuLink']],
      MenuIcon: [this.data['MenuIcon']],
      AuthorKey: [this.data['AuthorKey']],
      Sort: [this.data['Sort'] ? this.data['Sort'] : 1, [Validators.required]],
    });
  }

}
