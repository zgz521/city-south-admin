import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OprationService } from 'src/app/service/opration.service';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.less']
})
export class AddEditComponent implements OnInit {

  @Input() category: Array<object>;
  @Input() data: object;
  @Input() type: string;
  @Output() closed = new EventEmitter();
  @Output() submitOk = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  validateForm: FormGroup;
  expandKeys = [];
  constructor(private fb: FormBuilder, private postService: PostService, private oprationService: OprationService) { }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status == "VALID") {
      var data = this.validateForm.value;
      if (this.type === 'new') {
        this.postService.add(data).subscribe(result => {
          this.oprationService.tips(result, '新建成功');
          if (result['code'] == 'success')
            this.submitOk.emit(this.data);
        });
      }
      else if (this.type === 'edit') {
        //修改
        data['PostId'] = this.data['PostId'];
        this.postService.modify(data).subscribe(result => {
          this.oprationService.tips(result, '修改成功');
          if (result['code'] == 'success')
            this.submitOk.emit(this.data);
        });
      }
    }
  }

  findNode(nodes: any, id: number): any {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]['key'] === id) {
        return nodes[i]
      }
      else if (nodes[i]['children'] && nodes[i]['children'].length > 0) {
        let node = this.findNode(nodes[i]['children'], id);
        if (node)
          return node;
      }
    }
  }

  setDisabledNode(nodes: any, id: number, isDisabled?: boolean) {
    for (let i = 0; i < nodes.length; i++) {
      if (isDisabled || nodes[i]['key'] === id)
        nodes[i]['disabled'] = true;
      else
        nodes[i]['disabled'] = false;
      if (nodes[i]['children'] && nodes[i]['children'].length > 0) {
        let isDisabled = nodes[i]['key'] === id;
        this.setDisabledNode(nodes[i]['children'], id, isDisabled);
      }
    }
  }

  ngOnInit() {
    if (this.data['ParentPostId']) {
      let node = this.findNode(this.category, this.data['ParentPostId']);
      if (node) {
        this.expandKeys.push(node['key']);
        while (node['parent']) {
          node = node['parent'];
          this.expandKeys.push(node['key']);
        }
      }
    }
    let id = this.type === 'edit' ? this.data['PostId'] : 0;
    this.setDisabledNode(this.category, id);
    this.validateForm = this.fb.group({
      PostName: [this.data['PostName'], [Validators.required]],
      ParentPostId: [this.data['ParentPostId']],
      PostType: [this.data['PostType'], [Validators.required]],
    });
  }

}
