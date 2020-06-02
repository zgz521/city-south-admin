import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ArticleService } from 'src/app/service/article.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() data: any;
  @Input() estatelist: any[];
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  editSpan = 19;
  divHeight = (window.innerHeight - 303) + 'px';
  public Editor = ClassicEditor;
  validateForm!: FormGroup;

  close() {
    console.log('close');
    this.closed.emit();
  }

  handleOk() {
    console.log('submit');
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == "VALID") {
      let data = this.validateForm.value;
      data['AddTime'] = new Date();
      data['CategoryName'] = '系统公告';
      data['EstateIds'] = ',' + data['EstateIds'].join(',') + ',';
      if (this.data['ArticleId']) {
        //修改
        data['ArticleId'] = this.data['ArticleId'];
        this.articleService.modify(data).subscribe(result => {
          this.oprationService.tips(result, '文章修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
      else {
        //新增
        this.articleService.add(data).subscribe(result => {
          this.oprationService.tips(result, '文章新增成功');
          if (result['code'] == 'success')
            this.submitOk.emit();
        });
      }
    }
  }

  constructor(private articleService: ArticleService, private oprationService: OprationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    let EstateIds = [];
    if (!this.data['ArticleId']) {
      this.data['Content'] = '';
    }
    else {
      EstateIds = this.data['EstateIds'].replace(/^(\s|,)+|(\s|,)+$/g, '').split(',').map(Number);
    }
    this.validateForm = this.fb.group({
      Title: [this.data['Title'], [Validators.required]],
      GoUrl: [this.data['GoUrl']],
      EstateIds: [EstateIds, [Validators.required]],
      IsShow: [this.data['IsShow']],
      Content: [this.data['Content']]
    });
    setTimeout(() => {
      this.editSpan = 21;
    }, 100);
  }

}