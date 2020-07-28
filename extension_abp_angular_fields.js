
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { settings } = require('cluster');

const config = {
  appName: 'BookStore',
  entity: {
    name: "Blog",
    multiTenancySides: "Tenant",
    fields: [
      ["Name", "string"],
      ["Price", "number"],
      ["Type", "enum"],
      ["PurchaseDate", "date"],
      ["Qty", "number"],
      ["Paid", "date"],
      ["Active", "boolean"]
    ]
  },
  host: {
    component: "list",
    menuicon: "lock"
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated 
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.createWebBoilerplate',
    async function () {
      if (!vscode.workspace) {
        return vscode.window.showErrorMessage(
          'Please open a project folder first'
        );
      }

      CreateBoilerPlate();

    }
  );


  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

function CreateBoilerPlate() {
  const solutionPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const entityL = config.entity.name.toLowerCase();
  const srcPath = CreateDir(`${solutionPath}/${entityL}`);

  CreateFile(path.join(solutionPath, 'checklist.txt'), body(templates.checklist), () => {
    CreateFile(path.join(srcPath, `${entityL}.module.ts`), body(templates.module), () => {
      CreateFile(path.join(srcPath, `${entityL}.component.ts`), body(templates.componentTs), () => {

        var component = body(templates.componentHtml); 
        component = component.replace(/X-datatable-columns/g, GenDataColumns());
        component = component.replace(/X-form-controls/g, GenFormControls());

        CreateFile(path.join(srcPath, `${entityL}.component.html`), body(component), () => {
          CreateFile(path.join(srcPath, `${entityL}.component.spec.ts`), body(templates.componentSpec), () => {
            vscode.window.showErrorMessage('All Good!');
          });
        });
      });
    });
  });
}


function CreateDir(dir) {
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir); };
  return dir;
}

function CreateFile(url, body, next) {
  fs.writeFile(url, body, (err) => {
    if (err) {
      return console.log(err);
      vscode.window.showErrorMessage(
        'Failed to create boilerplate files'
      );
    }
    if (next) {
      next();
    }
  });
}

function GenDataColumns(){
  var output = '';
  config.entity.fields.forEach(f => {
    output += CreateColumn(config.entity.name, f);
  });
  return output;
}

function GenFormControls(){
  var output = '';
  config.entity.fields.forEach(f => {
    output += CreateFormControl(config.entity.name, f);
  });
  return output;
}


function CreateColumn(entity, field) {
  var f = field[0];
  var fl = f.toLowerCase();
  var fType = field[1];

  var types = ['date', 'currency'];
  switch (fType) {
    case 'enum':
      return  `<ngx-datatable-column [name]="'::${f}' | abpLocalization" prop="${fl}">
                <ng-template let-row="row" ngx-datatable-cell-template>
                  {{ '::Enum:${entity}${f}:' + row.${fl} | abpLocalization }}
                </ng-template>
              </ngx-datatable-column>
              `
      break;
      case 'currency': case 'date':
        return `<ngx-datatable-column [name]="'::${f}' | abpLocalization" prop="${fl}">
                <ng-template let-row="row" ngx-datatable-cell-template>
                  {{ row.${f} | ${fType} }}
                </ng-template>
              </ngx-datatable-column>
              `
        break;
  
    default:
      return `<ngx-datatable-column [${fl}]="'::${f}' | abpLocalization" prop="${fl}"></ngx-datatable-column>
              `
      break;
  } 

}

function CreateFormControl(entity, field) {
  var f = field[0];
  var fl = f.toLowerCase();
  var fType = field[1];
 
  switch (fType) {
    case 'enum':
      return  `<div class="form-group">
                  <label for="${entity}${f}">${f}</label><span> * </span>
                  <select class="form-control" id="${entity}${f}" formControlName="${fl}">
                    <option [ngValue]="null">Select a ${entity} ${fl}</option>
                    <option [ngValue]="${entity}${f}[type]" *ngFor="let type of ${entity}${f}s"> {{ ${fl} }}</option>
                  </select>
                </div>
              `
      break;
    case 'number':
      return  `<div class="form-group">
                <label for="${entity}-${fl}">${f}</label><span> * </span>
                <input type="number" id="${entity}-${fl}" class="form-control" formControlName="${fl}" />
              </div>
              `
      break;
    case 'date':
        return  `<div class="form-group">
                  <label for="${entity}-${fl}">${f}</label><span> * </span>
                  <input id="${entity}-${fl}" #datepicker="ngbDatepicker" class="form-control" name="datepicker" formControlName="${fl}"
                    ngbDatepicker (click)="datepicker.toggle()" />
                </div> 
                `
        break;
  
    default:
      return  `<div class="form-group">
                <label for="${entity}-${fl}">${f}</label><span> * </span>
                <input type="text" id="${entity}-${fl}" class="form-control" formControlName="${fl}" autofocus />
              </div> 
                `
      break;  

  }


}
function body(str) {
  str = str.replace(/X-ENTITY/g, config.entity.name);
  str = str.replace(/X-entity/g, config.entity.name.toLowerCase());
  str = str.replace(/X-icon/g, config.host.menuicon);
  str = str.replace(/X-AppName/g, config.appName);
  return str;
}

const templates = {
  checklist: `

abp generate-proxy

// Depends on  
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'; 

//app-routing.module.ts
{ path: 'X-entitys', loadChildren: () => import('./X-entity/X-entity.module').then(m => m.X-ENTITYModule) },

// route.provider.ts 
{ path: '/X-entitys-store', name: '::Menu:X-entitys', iconClass: 'fas fa-X-entitys', order: 2, layout: eLayoutType.application, },
{ path: '/X-entitys', name: '::X-ENTITY', parentName: '::Menu:X-ENTITY', layout: eLayoutType.application, requiredPolicy: 'X-AppName.X-ENTITY', },

    `,
  module: `
    
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { X-ENTITYRoutingModule } from './X-entity-routing.module';
import { X-ENTITYComponent } from './X-entity.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';  
import { AuthGuard, PermissionGuard } from '@abp/ng.core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: X-ENTITYComponent, canActivate: [AuthGuard, PermissionGuard] }];

@NgModule({
  declarations: [X-ENTITYComponent],
  imports: [
    RouterModule.forChild(routes), 
    SharedModule,
    NgbDatepickerModule,
  ]
})
export class X-ENTITYModule { }
    
    `,
  componentTs: `

import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { X-ENTITYDto, X-ENTITYType, CreateUpdateX-ENTITYDto } from './models';
import { X-ENTITYService } from './services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-X-entity',
  templateUrl: './X-entity.component.html', 
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }],
})
export class X-ENTITYComponent implements OnInit {
  X-entity = { items: [], totalCount: 0 } as PagedResultDto<X-ENTITYDto>;

  selectedX-ENTITY = new X-ENTITYDto(); // declare selectedX-ENTITY

  form: FormGroup;

  X-entityType = X-ENTITYType;

  X-entityTypes = Object.keys(this.X-entityType).filter((key) => typeof this.X-entityType[key] === 'number');

  isModalOpen = false;

  constructor(
    public readonly list: ListService,
    private X-entityService: X-ENTITYService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit() {
    const X-entityStreamCreator = (query) => this.X-entityService.getListByInput(query);

    this.list.hookToQuery(X-entityStreamCreator).subscribe((response) => {
      this.X-entity = response;
    });
  }

  createX-ENTITY() {
    this.selectedX-ENTITY = new X-ENTITYDto(); // reset the selected X-entity
    this.buildForm();
    this.isModalOpen = true;
  }

  // Add editX-ENTITY method
  editX-ENTITY(id: string) {
    this.X-entityService.getById(id).subscribe((X-entity) => {
      this.selectedX-ENTITY = X-entity;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedX-ENTITY.name || '', Validators.required],
      type: [this.selectedX-ENTITY.type || null, Validators.required],
      publishDate: [
        this.selectedX-ENTITY.publishDate ? new Date(this.selectedX-ENTITY.publishDate) : null,
        Validators.required,
      ],
      price: [this.selectedX-ENTITY.price || null, Validators.required],
    });
  }

  // change the save method
  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedX-ENTITY.id
      ? this.X-entityService.updateByIdAndInput(this.form.value, this.selectedX-ENTITY.id)
      : this.X-entityService.createByInput(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  // Add a delete method
  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.X-entityService.deleteById(id).subscribe(() => this.list.get());
      }
    });
  }
}
     
    `,
  componentHtml: `
<div class="card">
  <div class="card-header">
    <div class="row">
      <div class="col col-md-6">
        <h5 class="card-title">{{ '::Menu:X-ENTITY' | abpLocalization }}</h5>
      </div>
      <div class="text-right col col-md-6">

        <!-- Add the "new X-entity" button here -->
        <div class="text-lg-right pt-2">
          <button abpPermission="X-AppName.X-ENTITY.Create" id="create" class="btn btn-primary" type="button"
            (click)="createX-ENTITY()">
            <i class="fa fa-plus mr-1"></i>
            <span>{{ '::NewX-ENTITY' | abpLocalization }}</span>
          </button>
        </div>

      </div>
    </div>
  </div>
  <div class="card-body">
    <ngx-datatable [rows]="X-entity.items" [count]="X-entity.totalCount" [list]="list" default>
      X-datatable-columns
      <ngx-datatable-column [name]="'::Actions' | abpLocalization" [maxWidth]="150" [sortable]="false">
        <ng-template let-row="row" ngx-datatable-cell-template>
          <div ngbDropdown container="body" class="d-inline-block">
            <button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
              ngbDropdownToggle>
              <i class="fa fa-cog mr-1"></i>{{ '::Actions' | abpLocalization }}
            </button>
            <div ngbDropdownMenu>
              <button abpPermission="X-AppName.X-ENTITY.Update" ngbDropdownItem (click)="editX-ENTITY(row.id)">
                {{ '::Edit' | abpLocalization }}
              </button>
              <button abpPermission="X-AppName.X-ENTITY.Delete" ngbDropdownItem (click)="delete(row.id)">
                {{ '::Delete' | abpLocalization }}
              </button>
            </div>
          </div>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  </div>
  </div>

  <!-- Add the modal here -->
  <abp-modal [(visible)]="isModalOpen">
  <ng-template #abpHeader>
    <h3>{{ (selectedX-ENTITY.id ? '::Edit' : '::NewX-ENTITY' ) | abpLocalization }}</h3>
  </ng-template>

  <ng-template #abpBody>
    <form [formGroup]="form" (ngSubmit)="save()">
      X-form-controls
    </form>
  </ng-template>

  <ng-template #abpFooter>
    <button type="button" class="btn btn-secondary" #abpClose>
      {{ '::Close' | abpLocalization }}
    </button>

    <!--added save button-->
    <button class="btn btn-primary" (click)="save()" [disabled]="form.invalid">
      <i class="fa fa-check mr-1"></i>
      {{ '::Save' | abpLocalization }}
    </button>
  </ng-template>
  </abp-modal>
  
    `,
  componentSpec: `

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { X-ENTITYComponent } from './X-entity.component';

describe('X-ENTITYComponent', () => {
  let component: X-ENTITYComponent;
  let fixture: ComponentFixture<X-ENTITYComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ X-ENTITYComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(X-ENTITYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

    
    `

};