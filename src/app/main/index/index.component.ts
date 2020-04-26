import { Component, OnInit } from '@angular/core';
import { IndexService } from 'src/app/service/index.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {


  constructor(private indexService: IndexService) {
  };

  ngOnInit() {
  }
}