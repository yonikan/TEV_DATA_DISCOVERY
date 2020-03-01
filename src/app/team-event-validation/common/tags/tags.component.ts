import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Input() stepData: any;
  @Input() teamEventType: number;
  @Output() tagsEmitter = new EventEmitter<any>();

  visible = true;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  teamEventTagCtrl = new FormControl();
  filteredTeamEventTags: Observable<string[]>;
  teamEventTags: any[] = [];
  allTeamEventTags: string[] = [];
  teamEventTypeString: string;

  @ViewChild('teamEventTagsInput', {static: false}) teamEventTagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredTeamEventTags = this.teamEventTagCtrl.valueChanges
      .pipe(
        startWith(null),
        map((teamEventTag: string | null) => teamEventTag ? this._filter(teamEventTag) : this.allTeamEventTags.slice())
      );
  }

  ngOnInit() {
    if (this.teamEventType === 1){
      this.teamEventTypeString = 'training';
    } else if (this.teamEventType === 2) {
      this.teamEventTypeString = 'match';
    } else {
      this.teamEventTypeString = 'session';
    };

    if(this.stepData.tags && this.stepData.tags.length > 0) {
      this.stepData.tags.forEach(tag => {
        this.teamEventTags.push({name: tag})
      });
    }

    if(this.stepData.availableTagsList && this.stepData.availableTagsList.length > 0) {
      this.stepData.availableTagsList.forEach(tag => {
        this.allTeamEventTags.push(tag);
      });
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our teamEventTag
    if ((value || '').trim()) {
      this.teamEventTags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.teamEventTagCtrl.setValue(null);
    this.sendToTeamEvent(this.teamEventTags);
  }

  remove(teamEventTag: any): void {
    const index = this.teamEventTags.indexOf(teamEventTag);
    if (index >= 0) {
      this.teamEventTags.splice(index, 1);
    }
    this.sendToTeamEvent(this.teamEventTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.teamEventTags.push({name: event.option.viewValue});
    this.teamEventTagsInput.nativeElement.value = '';
    this.teamEventTagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTeamEventTags.filter(teamEventTag => teamEventTag.toLowerCase().indexOf(filterValue) === 0);
  }

  sendToTeamEvent(tags) {
    this.tagsEmitter.emit(tags);
  }
}
