import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {RestApiService} from '../services/rest-api.service'

import postData from './post.json';

/**
 * Weekly Node data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface WeeklyNode {
  name: string;
  children?: PostDetails[];
}
interface AuthorNode {
  name: string;
  children?: PostDetails[];
}
interface LocationNode {
  name: string;
  children?: PostDetails[];
}

export interface PostData {
  id: number;
  author: string;
  location: string;
  time: any;
  text: string;
}

export interface PostDetails {
  id: number;
  author: string;
  name: string;
  location: string;
  time: any;
  text: string;
  postedDate: Date;
}

let weeklyPostDetailMap = new Map<string, PostDetails[]>();
let authorPostDetailMap = new Map<string, PostDetails[]>();
let locationtDetailMap = new Map<string, PostDetails[]>();

let WEEKLY_TREE_DATA: WeeklyNode[] = [];
let AUTHOR_TREE_DATA: AuthorNode[] = [];
let LOCATION_TREE_DATA: LocationNode[] = [];

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})

export class TreeviewComponent {

  public postDataList: PostData[] = postData;
  public postDetailsList: PostDetails[] = [];
  public selectedNode: string = '';
  public selectedPost: PostDetails = {
    id: -1,
    author: '',
    name: '',
    location: '',
    time: '',
    text: '',
    postedDate: new Date()
  };
  public editingNode: string = '';
  public editingField: string = '';
  public locationInput: string = '';
  public authorInput: string = '';
  public showLocationError: boolean = false;
  public showAuthorError: boolean = false;
  public toggleGroupBySelect: string = 'weekly';

  private _transformer = (node: WeeklyNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  constructor(public restApiService : RestApiService) {
    //loading post data from rest api
    restApiService.getPostDetails().subscribe( data => {
      this.postDataList = data;
      this.constructpostDetailsList(this.postDataList);

      this.constructWeeklyTreeData();
      this.constructorAuthorTreeData();
      this.constructorLocationTreeData();
  
      console.log(weeklyPostDetailMap);
      console.log(authorPostDetailMap);
      console.log(locationtDetailMap);
      this.constructorTreeDataWeekly();
      this.constructorTreeDataAuthor();
      this.constructorTreeDataLocation();
      // set default toggle button as weekly
      this.onToggleGroupChange('weekly');
    });

  }

  private constructpostDetailsList(postDataList : PostData[]) : void{
    this.postDataList.forEach(postdata => {
      this.postDetailsList.push({
        id: postdata.id,
        author: postdata.author,
        name: postdata.id.toString(),
        location: postdata.location,
        time: postdata.time,
        text: postdata.text,
        postedDate: new Date(postdata.time * 1000)
      });
    });
  }

  private derivePostWeek(postDetail: PostDetails): string {
    console.log('Retrieving Week from Post... ');
    let postYear = postDetail.postedDate.getUTCFullYear();
    let postMonth = postDetail.postedDate.getUTCMonth();
    let date = postDetail.postedDate;
    let adjustedDate = date.getDate() + date.getDay();
    let prefixes = ['0', '1', '2', '3', '4', '5'];
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    let postedWeek = (parseInt(prefixes[0 | adjustedDate / 7]) + 1);
    return postYear + "-" + postMonth + "- Week " + postedWeek;
  }

  private constructWeeklyTreeData(): void {
    weeklyPostDetailMap = new Map<string, PostDetails[]>();
    this.postDetailsList.forEach(postDetails => {
      let postDetailMapKey = this.derivePostWeek(postDetails);
      console.log('posted details map key: %s', postDetailMapKey);
      let weeklyPostDetailsList = [];
      if (!weeklyPostDetailMap.has(postDetailMapKey)) {
        weeklyPostDetailsList.push(postDetails);
        weeklyPostDetailMap.set(postDetailMapKey, weeklyPostDetailsList);
      } else {
        weeklyPostDetailMap.get(postDetailMapKey)?.forEach(existingPostDetails => {
          weeklyPostDetailsList.push(existingPostDetails);
        });
        weeklyPostDetailsList.push(postDetails);
      }
      weeklyPostDetailMap.set(postDetailMapKey, weeklyPostDetailsList);
    });
  }

  private constructorTreeDataWeekly(): void {
    WEEKLY_TREE_DATA = [];
    weeklyPostDetailMap.forEach((value: PostDetails[], key: string) => {
      console.log('Tree Data Key: %s', key);
      let weeklyNode: WeeklyNode = {
        name: key,
        children: value
      }
      WEEKLY_TREE_DATA.push(weeklyNode);
    });
  }

  private constructorAuthorTreeData(): void {
    authorPostDetailMap = new Map<string, PostDetails[]>();
    this.postDetailsList.forEach(postDetails => {
      console.log('posted details map key: %s', postDetails.author);
      let authorPostDetailsList = [];
      if (!authorPostDetailMap.has(postDetails.author)) {
        authorPostDetailsList.push(postDetails);
        authorPostDetailMap.set(postDetails.author, authorPostDetailsList);
      } else {
        authorPostDetailMap.get(postDetails.author)?.forEach(existingPostDetails => {
          authorPostDetailsList.push(existingPostDetails);
        });
        authorPostDetailsList.push(postDetails);
      }
      authorPostDetailMap.set(postDetails.author, authorPostDetailsList);
    });
  }

  private constructorTreeDataAuthor(): void {
    AUTHOR_TREE_DATA = [];
    authorPostDetailMap.forEach((value: PostDetails[], key: string) => {
      console.log('Tree Data Key: %s', key);
      let authorNode: AuthorNode = {
        name: key,
        children: value
      }
      AUTHOR_TREE_DATA.push(authorNode);
    });
  }

  private constructorLocationTreeData(): void {
    locationtDetailMap =  new Map<string, PostDetails[]>();
    this.postDetailsList.forEach(postDetails => {
      console.log('posted details map key: %s', postDetails.location);
      let locationPostDetailsList = [];
      if (!locationtDetailMap.has(postDetails.location)) {
        locationPostDetailsList.push(postDetails);
        locationtDetailMap.set(postDetails.location, locationPostDetailsList);
      } else {
        locationtDetailMap.get(postDetails.location)?.forEach(existingPostDetails => {
          locationPostDetailsList.push(existingPostDetails);
        });
        locationPostDetailsList.push(postDetails);
      }
      locationtDetailMap.set(postDetails.location, locationPostDetailsList);
    });
  }

  private constructorTreeDataLocation(): void {
    LOCATION_TREE_DATA = [];
    locationtDetailMap.forEach((value: PostDetails[], key: string) => {
      console.log('Tree Data Key: %s', key);
      let locationNode: LocationNode = {
        name: key,
        children: value
      }
      LOCATION_TREE_DATA.push(locationNode);
    });
  }

  onToggleGroupChange(buttonName: string): void {
    this.clearEditingNode();
    this.clearSelectedNode();
    switch (buttonName) {
      case 'weekly':
        console.log('Toggle to weekly group by');
        this.toggleGroupBySelect = 'weekly';
        this.dataSource.data = WEEKLY_TREE_DATA;
        break;
      case 'author':
        console.log('Toggle to author group by');
        this.toggleGroupBySelect = 'author';
        this.dataSource.data = AUTHOR_TREE_DATA;
        break;
      case 'location':
        console.log('Toggle to location group by');
        this.toggleGroupBySelect = 'location';
        this.dataSource.data = LOCATION_TREE_DATA;
        break;
    }
  }

  onNodeClick(nodeName: string): void {
    this.clearEditingNode();
    if (nodeName === this.selectedNode) {
      this.clearSelectedNode();
    } else {
      this.selectedNode = nodeName;

      this.selectedPost = this.retrieveSelectedPostFromPostDetailMap(nodeName);
    }
  }

  private retrieveSelectedPostFromPostDetailMap(nodeName: string): PostDetails {
    let selectedPostDetail: any = {};
    this.postDetailsList.forEach(postDetails => {
      if (nodeName === postDetails.name) {
        selectedPostDetail = postDetails;
      }
    });
    return selectedPostDetail;
  }

  public onEditNode(editNodeName: string, editField: string): void {
    this.editingNode = editNodeName;
    this.editingField = editField;
  }

  public onSaveNode(editNodeName: string, editField: string, event: Event): void {

    this.locationInput = '';
    this.authorInput = '';
    this.showLocationError = false;
    this.showAuthorError = false;

    if (document.getElementById("Location-" + editNodeName) !== undefined &&
      document.getElementById("Location-" + editNodeName) !== null) {
      this.locationInput = (<HTMLInputElement>document.getElementById("Location-" + editNodeName)).value;
    }
    if (document.getElementById("Author-" + editNodeName) !== undefined &&
      document.getElementById("Author-" + editNodeName) !== null) {
      this.authorInput = (<HTMLInputElement>document.getElementById("Author-" + editNodeName)).value;
    }

    if (editField === 'Location' && (this.locationInput === undefined || this.locationInput === '')) {
      this.showLocationError = true;
      return;
    }
    if (editField === 'Author' && (this.authorInput === undefined || this.authorInput === '')) {
      this.showAuthorError = true;
      return;
    }

    
    this.editingNode = '';
    this.editingField = '';
    let editingPostDetails: any = {};
    let modifiedPostDetails: any = {};

    this.postDetailsList.forEach(postDetails => {
      if (editNodeName === postDetails.name) {
        editingPostDetails = postDetails;
      }
    });
    let indexOfEditingPostDetails = this.postDetailsList.findIndex((postDetails) => {
      return postDetails.name === editNodeName;
    });
    console.log('Removing Post Detail Object:', indexOfEditingPostDetails);
    // check if the index exist in the postDetail list
    if (indexOfEditingPostDetails !== -1) {
      this.postDetailsList.splice(indexOfEditingPostDetails, 1);
    }
    //update post details
    if (editField === 'Location') {
      modifiedPostDetails = {
        id: editingPostDetails.id,
        author: editingPostDetails.author,
        name: editingPostDetails.name,
        location: this.locationInput,
        time: editingPostDetails.time,
        text: editingPostDetails.text,
        postedDate: editingPostDetails.postedDate
      }
    } else if (editField === 'Author') {
      modifiedPostDetails = {
        id: editingPostDetails.id,
        author: this.authorInput,
        name: editingPostDetails.name,
        location: editingPostDetails.location,
        time: editingPostDetails.time,
        text: editingPostDetails.text,
        postedDate: editingPostDetails.postedDate
      }
    }
    this.postDetailsList.push(modifiedPostDetails);
    
    this.constructWeeklyTreeData();
    this.constructorAuthorTreeData();
    this.constructorLocationTreeData();

    //recreate tree data 
    this.constructorTreeDataWeekly();
    this.constructorTreeDataAuthor();
    this.constructorTreeDataLocation();

        //setting up selection node changes
    if(this.toggleGroupBySelect === 'location' && editField === 'Location'){
      this.clearSelectedNode();
      this.onToggleGroupChange('location');
    } else if (this.toggleGroupBySelect === 'author' && editField === 'Author'){
      this.clearSelectedNode();
      this.onToggleGroupChange('author');
    } else {
      this.selectedPost = modifiedPostDetails;
    }

  }

  public onCancelNode(editNodeName: string, editField: string, event: Event): void {
    this.clearEditingNode();
  }

  private clearEditingNode () : void {
    this.locationInput = '';
    this.authorInput = '';
    this.showLocationError = false;
    this.showAuthorError = false;
    this.editingNode = '';
    this.editingField = '';
  }

  private clearSelectedNode () : void {
    this.selectedNode = '';
      this.selectedPost = {
        id: -1,
        author: '',
        name: '',
        location: '',
        time: '',
        text: '',
        postedDate: new Date()
      };
  }
}
