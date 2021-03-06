import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ActionConfig } from '../../action/action-config';
import { ActionModule } from '../../action/action.module';
import { EmptyStateConfig } from '../../empty-state/empty-state-config';
import { EmptyStateModule } from '../../empty-state/empty-state.module';
import { ListComponent } from './list.component';
import { ListConfig } from './list-config';
import { SortArrayPipeModule } from '../../pipe/sort-array/sort-array.pipe.module';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';

describe('List component - ', () => {
  let comp: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  let actionConfig: ActionConfig;
  let config: ListConfig;
  let emptyStateConfig: EmptyStateConfig;
  let items: any[];

  beforeEach(() => {
    items = cloneDeep(ITEMS);
    actionConfig = cloneDeep(ACTION_CONFIG);
    emptyStateConfig = cloneDeep(EMPTY_STATE_CONFIG);

    config = {
      dblClick: false,
      emptyStateConfig: emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      selectionMatchProp: 'name',
      showCheckbox: true,
      useExpandingRows: false
    } as ListConfig;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ActionModule,
        BrowserAnimationsModule,
        EmptyStateModule,
        FormsModule,
        SortArrayPipeModule
      ],
      declarations: [ListComponent],
      providers: []
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ListComponent);
        comp = fixture.componentInstance;
        comp.config = config;
        comp.items = items;
        fixture.detectChanges();
      });
  }));

  it('should have correct number of rows', () => {
    let elements = fixture.debugElement.queryAll(By.css('.list-pf-item'));
    expect(elements.length).toBe(8);
  });

  it('should show the select checkbox by default', function() {
    let listItems = fixture.debugElement.queryAll(By.css('.list-pf-item'));
    let checkItems = fixture.debugElement.queryAll(By.css('.list-pf-select'));

    expect(checkItems.length).toBe(items.length);

    // allow item selection
    config.selectItems = false;
    fixture.detectChanges();

    listItems[1].triggerEventHandler('click', {});
    fixture.detectChanges();

    let selectedItems = fixture.debugElement.queryAll(By.css('.active'));
    expect(selectedItems.length).toBe(0);
  });

  it('should not show the select checkboxes when showCheckbox is false', function() {
    let checkItems = fixture.debugElement.queryAll(By.css('.list-pf-select'));

    expect(checkItems.length).toBe(items.length);

    // disallow checkbox selection
    config.showCheckbox = false;
    fixture.detectChanges();

    checkItems = fixture.debugElement.queryAll(By.css('.list-pf-select'));
    expect(checkItems.length).toBe(0);
  });

  it('should not allow selection when selectItems is false', function() {
    let listItems = fixture.debugElement.queryAll(By.css('.list-pf-item'));
    let selectedItems = fixture.debugElement.queryAll(By.css('.active'));

    expect(selectedItems.length).toBe(0);

    // allow item selection
    config.selectItems = false;
    fixture.detectChanges();

    listItems[1].triggerEventHandler('click', {});
    fixture.detectChanges();

    selectedItems = fixture.debugElement.queryAll(By.css('.active'));
    expect(selectedItems.length).toBe(0);
  });

  it('should add active class to clicked list item', function() {
    let listItems = fixture.debugElement.queryAll(By.css(
      '.list-pf-content.list-pf-content-flex .list-pf-content.list-pf-content-flex'));
    let selectedItems = fixture.debugElement.queryAll(By.css('.active'));

    expect(selectedItems.length).toBe(0);

    // allow item selection
    config.selectItems = true;
    config.showCheckbox = false;
    fixture.detectChanges();

    listItems[1].triggerEventHandler('click', {});
    fixture.detectChanges();

    selectedItems = fixture.debugElement.queryAll(By.css('.active'));
    expect(selectedItems.length).toBe(1);
  });

  it('should manage selected items', function() {
    let listItems = fixture.debugElement.queryAll(By.css(
      '.list-pf-content.list-pf-content-flex .list-pf-content.list-pf-content-flex'));
    let selectedItems = fixture.debugElement.queryAll(By.css('.active'));

    // allow item selection
    config.selectItems = true;
    config.showCheckbox = false;
    fixture.detectChanges();

    listItems[1].triggerEventHandler('click', {});
    fixture.detectChanges();

    selectedItems = fixture.debugElement.queryAll(By.css('.active'));
    expect(selectedItems.length).toBe(1);
  });

  it('should respect the multiSelect setting', function() {
    let listItems = fixture.debugElement.queryAll(By.css(
      '.list-pf-content.list-pf-content-flex .list-pf-content.list-pf-content-flex'));
    let selectedItems = fixture.debugElement.queryAll(By.css('.active'));

    expect(selectedItems.length).toBe(0);

    // allow item selection
    config.selectItems = true;
    config.showCheckbox = false;
    config.multiSelect = false;
    fixture.detectChanges();

    listItems[1].triggerEventHandler('click', {});
    fixture.detectChanges();

    selectedItems = fixture.debugElement.queryAll(By.css('.active'));
    expect(selectedItems.length).toBe(1);

    listItems[2].triggerEventHandler('click', {});
    fixture.detectChanges();

    selectedItems = fixture.debugElement.queryAll(By.css('.active'));
    expect(selectedItems.length).toBe(1);

    config.multiSelect = true;
    fixture.detectChanges();

    listItems[3].triggerEventHandler('click', {});
    fixture.detectChanges();

    selectedItems = fixture.debugElement.queryAll(By.css('.active'));
    expect(selectedItems.length).toBe(2);
  });

  it('should not allow both row and checkbox selection', function() {
    let exceptionRaised = false;
    let badConfig = {
      selectItems: true,
      showCheckbox: true
    };

    try {
      comp.config = badConfig;
      fixture.detectChanges();
    } catch (e) {
      exceptionRaised = true;
    }
    expect(exceptionRaised).toBe(true);
  });

  it('should allow expand items', function() {
    config.useExpandItems = true;
    fixture.detectChanges();

    let listItems = fixture.debugElement.queryAll(By.css('.list-pf-chevron .fa-angle-right'));
    expect(items.length).toBe(8);

    listItems[0].triggerEventHandler('click', {});
    fixture.detectChanges();

    let openItem = fixture.debugElement.queryAll(By.css('.list-pf-chevron .fa-angle-right.fa-angle-down'));
    expect(openItem.length).toBe(1);
  });

  it('should show the empty state when specified', function() {
    comp.items = [];
    fixture.detectChanges();

    let title = fixture.debugElement.query(By.css('#title'));
    expect(title.nativeElement.textContent.trim().slice(0, 'No Items Available'.length)).toBe('No Items Available');
  });
});


describe('List component - ', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ActionModule,
        BrowserAnimationsModule,
        EmptyStateModule,
        FormsModule,
        SortArrayPipeModule,
      ],
      declarations: [
        ListComponent,
        TestComponent
      ],
      providers: []
    });
  }));

  it('should not re-render nested components when trackByFn is properly set', async(() => {
    const template = `
      <pfng-list
            [config]="config"
            [items]="items"
            [trackBy]="trackByIndex"
            [actionTemplate]="actionTemplate"
            [itemTemplate]="itemTemplate">
          <ng-template #itemTemplate let-item="item" let-index="index">
            {{ item.name }}
          </ng-template>
          <ng-template #actionTemplate let-item="item" let-index="index">
            <pfng-action class="list-pf-actions"
                [config]="actionConfig">
            </pfng-action>
          </ng-template>
      </pfng-list>
    `;
    fixture = createTestComponent(template);
    fixture.detectChanges();

    let dropdownToggles = fixture.debugElement.queryAll(By.css('.dropdown-toggle'));
    dropdownToggles[0].triggerEventHandler('click', {});
    fixture.detectChanges();

    fixture.componentInstance.items = cloneDeep(fixture.componentInstance.items);
    fixture.detectChanges();

    let openMenus = fixture.debugElement.queryAll(By.css('.dropdown.open'));
    expect(openMenus.length).toBe(1);
  }));
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent implements OnInit {
  actionConfig: ActionConfig;
  config: ListConfig;
  emptyStateConfig: EmptyStateConfig;
  items: any[];

  ngOnInit() {
    this.items = cloneDeep(ITEMS);
    this.actionConfig = cloneDeep(ACTION_CONFIG);
    this.emptyStateConfig = cloneDeep(EMPTY_STATE_CONFIG);

    this.config = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      selectionMatchProp: 'name',
      showCheckbox: false,
      useExpandingRows: false
    } as ListConfig;
  }

  trackByIndex(index: number) {
    return index;
  }
}

function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, {set: {template: template}})
    .createComponent(TestComponent);
}


const ITEMS = [{
  name: 'Fred Flintstone',
  address: '20 Dinosaur Way',
  city: 'Bedrock',
  state: 'Washingstone'
}, {
  name: 'John Smith',
  address: '415 East Main Street',
  city: 'Norfolk',
  state: 'Virginia',
  rowExpansionDisabled: true
}, {
  name: 'Frank Livingston',
  address: '234 Elm Street',
  city: 'Pittsburgh',
  state: 'Pennsylvania'
}, {
  name: 'Linda McGovern',
  address: '22 Oak Street',
  city: 'Denver',
  state: 'Colorado'
}, {
  name: 'Jim Brown',
  address: '72 Bourbon Way',
  city: 'Nashville',
  state: 'Tennessee'
}, {
  name: 'Holly Nichols',
  address: '21 Jump Street',
  city: 'Hollywood',
  state: 'California'
}, {
  name: 'Marie Edwards',
  address: '17 Cross Street',
  city: 'Boston',
  state: 'Massachusetts'
}, {
  name: 'Pat Thomas',
  address: '50 Second Street',
  city: 'New York',
  state: 'New York'
}];

const ACTION_CONFIG = {
  primaryActions: [{
    id: 'action1',
    title: 'Main Action',
    tooltip: 'Start the server'
  }],
  moreActions: [{
    id: 'action2',
    title: 'Secondary Action 1',
    tooltip: 'Do the first thing'
  }, {
    id: 'action3',
    title: 'Secondary Action 2',
    tooltip: 'Do something else'
  }, {
    id: 'action4',
    title: 'Secondary Action 3',
    tooltip: 'Do something special'
  }]
} as ActionConfig;

const EMPTY_STATE_CONFIG = {
  actions: ACTION_CONFIG,
  iconStyleClass: 'pficon-warning-triangle-o',
  info: 'This is the Empty State component. The goal of a empty state pattern is to provide a good first ' +
    'impression that helps users to achieve their goals. It should be used when a list is empty because no ' +
    'objects exists and you want to guide the user to perform specific actions.',
  helpLink: {
    hypertext: 'EmptyState example',
    text: 'For more information please see the',
    url: '/emptystate'
  },
  title: 'No Items Available'
} as EmptyStateConfig;
