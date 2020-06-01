import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ArticleService } from 'src/app/service/article.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  isLoading = false;
  public Editor = ClassicEditor;
  validateForm!: FormGroup;

  close() {
    this.submitOk.emit();
    this.closed.emit();
  }

  handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    console.log(this.validateForm.value);
  }

  constructor(private articleService: ArticleService, private fb: FormBuilder) { }

  ngOnInit(): void {
    if (!this.data['ArticleId']) {
      this.data['Content'] = 'Hellow world!';
    }
    this.validateForm = this.fb.group({
      Title: [this.data['Title'], [Validators.required]],
      GoUrl: [this.data['GoUrl']],
      EstateIds: [this.data['EstateIds']],
      IsShow: [this.data['IsShow']],
      Content: [this.data['Content']]
    });
    setTimeout(() => {
      this.editSpan = 22;
    }, 100);
  }

}