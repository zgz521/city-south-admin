import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EstateService } from 'src/app/service/estate.service';
import { OprationService } from 'src/app/service/opration.service';

@Component({
  selector: 'app-introduct',
  templateUrl: './introduct.component.html',
  styleUrls: ['./introduct.component.less']
})
export class IntroductComponent implements OnInit {

  @Input() data: any;
  @Output() closed = new EventEmitter();
  divHeight = (window.innerHeight - 303) + 'px';
  divWidth = "99%";
  public Editor = ClassicEditor;

  constructor(private estateService: EstateService, private oprationService: OprationService) { }

  save() {
    this.estateService.changeIntroduct(this.data).subscribe(result => {
      this.oprationService.tips(result, '保存成功');
    });
  }

  close() {
    this.closed.emit();
  }

  ngOnInit() {
    setTimeout(() => {
      this.divWidth = "100%";
    }, 100);
  }

}
