import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { PostData, TreeviewComponent } from './treeview.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTreeModule, MatTreeNode } from '@angular/material/tree';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Observable, throwError } from 'rxjs';
import { RestApiService } from '../services/rest-api.service';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';



describe('TreeviewComponent', () => {
  let component: TreeviewComponent;
  let component2: TreeviewComponent;
  let fixture: ComponentFixture<TreeviewComponent>;
  let loader: HarnessLoader;
  let restApiService: RestApiService;
  let fakeRestApiService: RestApiService;

  let post_data = [
    {
      "id": 1,
      "location": "San Francisco",
      "time": "1552657573",
      "author": "Happy User",
      "text": "Proper PDF conversion ensures that every element of your document remains just as you left it."
    },
    {
      "id": 2,
      "location": "San Francisco",
      "time": "1552571173",
      "author": "Happy User",
      "text": "The modern workplace is increasingly digital, and workflows are constantly evolving. "
    },
    {
      "id": 3,
      "location": "San Francisco",
      "time": "1552571174",
      "author": "Happy Developer",
      "text": "Digital transformation isn’t just a buzzword"
    },
    {
      "id": 4,
      "location": "Sydney",
      "time": "1552563973",
      "author": "Happy Developer",
      "text": "An expectation of digital efficiency has become the norm in our daily lives"
    },
    {
      "id": 5,
      "location": "Dublin",
      "time": "1553080742",
      "author": "Happy Manager",
      "text": "A modern PDF annotator that can accommodate all of the cooks in a very busy kitchen is what your employees really need."
    },
    {
      "id": 6,
      "location": "Dublin",
      "time": "1553099742",
      "author": "Happy Manager",
      "text": "An integrated productivity solution breaks information through barriers and allows workers to collaborate in real time."
    }
  ];

  beforeEach(async () => {
    fakeRestApiService = jasmine.createSpyObj<RestApiService>(
      'RestApiService',
      {
        getPostDetails: of(post_data)
      }
    );
    await TestBed.configureTestingModule({
      declarations: [TreeviewComponent],
      imports: [MatButtonToggleModule, MatTreeModule, MatIconModule],
      providers: [HttpClientModule, HttpClient, HttpHandler, { provide: RestApiService, useValue: fakeRestApiService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    restApiService = TestBed.inject(RestApiService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Click on Weekly Toggle Button', () => {
    component.onToggleGroupChange('weekly');
    expect(component.toggleGroupBySelect).toBe('weekly');
    console.log('weekly toggle clicked');

  });

  it('Click on Author Toggle Button', () => {
    component.onToggleGroupChange('author');
    expect(component.toggleGroupBySelect).toBe('author');
    console.log('author toggle clicked');

  });

  it('Click on Location Toggle Button', () => {
    component.onToggleGroupChange('location');
    expect(component.toggleGroupBySelect).toBe('location');
    console.log('author toggle clicked');

  });

  it('Toggle Button HTML Click', () => {
    const weeklyToggleBtn = fixture.debugElement.query(By.css('.toggle-button-weekly')).nativeElement;
    weeklyToggleBtn.click();
    expect(component.toggleGroupBySelect).toBe('weekly');
    console.log('weekly toggle clicked');

  });

  it('Node Click on same selected Event', () => {
    component.selectedNode = '1';
    component.onNodeClick('1');
    expect(component.selectedNode).toBe('');
  });

  it('Node Click on different selected Event', () => {
    component.selectedNode = '1';
    component.onNodeClick('2');
    expect(component.selectedNode).toBe('2');
  });

  it('Edit Click On Posts', () => {
    component.onEditNode('1', 'Location');
    expect(component.editingNode).toBe('1');
    expect(component.editingField).toBe('Location');
  });

  it('Cancel Node Click On Posts', () => {
    const weeklyToggleBtn = fixture.debugElement.query(By.css('.toggle-button-weekly')).nativeElement;
    component.onCancelNode('1', 'Location', weeklyToggleBtn);
    expect(component.locationInput).toBe('');
    expect(component.authorInput).toBe('');
    expect(component.showLocationError).toBe(false);
    expect(component.showAuthorError).toBe(false);
    expect(component.editingNode).toBe('');
    expect(component.editingField).toBe('');
  });


  it('Save Click Error On Location', () => {
    const weeklyToggleBtn = fixture.debugElement.query(By.css('.toggle-button-weekly')).nativeElement;
    component.onSaveNode('1', 'Location', weeklyToggleBtn);
  });

  it('Save Click Error On Author', () => {
    const weeklyToggleBtn = fixture.debugElement.query(By.css('.toggle-button-weekly')).nativeElement;
    component.onSaveNode('1', 'Author', weeklyToggleBtn);
  });

  it('Save Click Error On Author 2', () => {
    const weeklyToggleBtn = fixture.debugElement.nativeElement.querySelector('.root-tree-node');
    fixture.debugElement.nativeElement.querySelector('.root-tree-node').getElementsByTagName('button')[0].click();
    component.selectedNode = '1';
    fixture.debugElement.nativeElement.querySelector('.mat-tree-leaf-node').getElementsByTagName('button')[1].click();

    console.log('weekly toggle clicked');
    // component.onSaveNode('1', 'Author', weeklyToggleBtn);
  });



});
