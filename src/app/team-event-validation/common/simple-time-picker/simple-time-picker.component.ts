import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-simple-time-picker',
  templateUrl: './simple-time-picker.component.html',
  styleUrls: ['./simple-time-picker.component.scss']
})
export class SimpleTimePickerComponent implements OnInit {
  @Input() label = '';
  @Input() propName = '';
  @Input() maxPropName = '';
  @Input() range = {};
  @Input() offset: any = 0;
  @Output() updateTime = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onUpdateTime(e) {
    this.updateTime.emit(e);
  }

  getTimeStr(time) {
    const d = new Date(time);
    return `${`${d.getHours()}`.padStart(2, '0')}:${`${d.getMinutes()}`.padStart(2, '0')}`
  }

}
