
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { settings } = require('cluster');

const config = {
    appName: 'KM',
    entity: {
        name: "Blog",
        multiTenancySides: "Tenant",
        fields: [
            ["Name", "string"],
            ["Name", "int"]
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
    const srcPath = CreateDir(`${solutionPath}/src`);
    vscode.window.showErrorMessage(solutionPath);

    CreateFile(path.join(solutionPath, 'checklist.txt'), body(templates.checklist), () => {

        const corePath = CreateDir(`${srcPath}/${config.appName}.Core`);
        const corePathE = CreateDir(`${srcPath}/${config.appName}.Core/${config.entity.name}s`);

        CreateFile(path.join(corePathE, `${config.entity.name}.cs`), body(templates.serverside.entity), () => {

            const ServerAppPath = CreateDir(`${srcPath}/${config.appName}.Application`);
            const ServerAppPathE = CreateDir(`${srcPath}/${config.appName}.Application/${config.entity.name}s`);

            CreateFile(path.join(ServerAppPathE, `${config.entity.name}AppService.cs`), body(templates.serverside.appService), () => {
                CreateFile(path.join(ServerAppPathE, `Create${config.entity.name}Dto.cs`), body(templates.serverside.createdtos), () => {
                    CreateFile(path.join(ServerAppPathE, `${config.entity.name}Dto.cs`), body(templates.serverside.entityDto), () => {

                        const entityL = config.entity.name.toLowerCase();
                        const appPath = CreateDir(`${srcPath}/${config.appName}.Web.Host`);
                        const appPathsrc = CreateDir(`${appPath}/src`);
                        const appPathsrcApp = CreateDir(`${appPathsrc}/app`);
                        const appPathE = CreateDir(`${appPathsrcApp}/${entityL}s`);

                        CreateFile(path.join(appPathE, `${entityL}s.component.ts`), body(templates.listTS), () => {
                            CreateFile(path.join(appPathE, `${entityL}s.component.html`), body(templates.listHtml), () => {

                                const appPathCE = CreateDir(`${appPathE}/${entityL}-edit`);

                                CreateFile(path.join(appPathCE, `${entityL}-edit.component.ts`), body(templates.editTS), () => {
                                    CreateFile(path.join(appPathCE, `${entityL}-edit.component.html`), body(templates.editHTML), () => {

                                        const appPathCC = CreateDir(`${appPathE}/${entityL}-create`);
                                        CreateFile(path.join(appPathCC, `${entityL}-create.component.ts`), body(templates.createTS), () => {
                                            CreateFile(path.join(appPathCC, `${entityL}-create.component.html`), body(templates.createHTML), () => {
                                                vscode.window.showErrorMessage('All Good!');
                                            });
                                        });
                                    });
                                });
                            });
                        });
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

function body(str) {
    str = str.replace(/X-ENTITY/g, config.entity.name);
    str = str.replace(/X-entity/g, config.entity.name.toLowerCase());
    str = str.replace(/X-icon/g, config.host.menuicon);
    str = str.replace(/X-AppName/g, config.appName);
    return str;
}

const templates = {
    checklist: `

// Server-Side  
    - Add Entity in Core  
    - Add to DbContext 
        public DbSet<X-ENTITY> X-ENTITYs { get; set; }  
    - Add Migration and Update  
    - Add a DTO in Application  

    - Register a Permission names => PermissionNames.cs 
        public const string Pages_X-ENTITYs = "Pages.X-ENTITYs";
    - Register a Permission => LeesStoreAuthorizationProvider.cs 
        context.CreatePermission(PermissionNames.Pages_X-ENTITYs, L("X-ENTITY"), multiTenancySides: MultiTenancySides.Tenant);
    - localization  to LeesStore.xml  
        <text name="X-ENTITYs" value="X-ENTITYs" />
    - Add an AppService  
    - Run App, See Swagger Update  
 
// Client-Side  
    - Update nSwag .\  
    - Register Service Proxy  
        ApiServiceProxies.X-ENTITYsServiceProxy, 
    - Update Left-Hand Nav  => sidebar-nav.component.ts 
        new MenuItem(this.l('X-ENTITYs'), '/app/X-ENTITYs', 'fas fa-X-icon', 'Pages.X-ENTITYs')  
    - Entity components  
    - Update Route 
        import { X-ENTITYsComponent } from './X-entitys/X-entitys.component';
        { path: 'X-entity', component: X-ENTITYsComponent, data: { permission: 'Pages.X-ENTITYs' }, canActivate: [AppRouteGuard] }, 
    - Register new components in app.module.ts 
        import { X-ENTITYModule } from './X-entitys/X-entitys.module'; 
    `,
    listHtml: `
    <div [@routerTransition]>
    <section class="content-header">
      <div class="container-fluid">
        <div class="row">
          <div class="col-6">
            <h1>{{ "X-ENTITYs" | localize }}</h1>
          </div>
          <div class="col-6 text-right">
            <a href="javascript:;" class="btn bg-blue" (click)="createX-ENTITY()">
              <i class="fa fa-plus-square"></i>
              {{ "Create" | localize }}
            </a>
          </div>
        </div>
      </div>
    </section>
    <section class="content px-2">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <div class="input-group">
              <div class="input-group-prepend">
                <button type="button" class="btn bg-blue" (click)="getDataPage(1)">
                  <i class="fas fa-search"></i>
                </button>
              </div>
              <input type="text" class="form-control" name="keyword" [placeholder]="'SearchWithThreeDot' | localize"
                [(ngModel)]="keyword" (keyup.enter)="getDataPage(1)" />
            </div>
          </div>
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap" [busy]="isTableLoading">
              <thead class="bg-light">
                <tr>
                  <th>{{ "Name" | localize }}</th>
                  <th>{{ "DisplayName" | localize }}</th>
                  <th style="width: 200px;">{{ "Actions" | localize }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of X-entitys | paginate
                      : { id: 'server',  itemsPerPage: pageSize,currentPage: pageNumber,totalItems: totalItems}">
                  <td>{{ item.name }}</td>
                  <td>{{ item.displayName }}</td>
                  <td>
                    <button type="button" class="btn btn-sm bg-secondary" (click)="editX-ENTITY(item)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button type="button" class="btn btn-sm bg-danger mx-2" (click)="deleteX-ENTITY(item)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer bg-light border-top">
            <div class="row">
              <div class="col-sm-4 col-12 text-sm-left text-center">
                <button class="btn btn-secondary" (click)="refresh()">
                  <i class="fas fa-redo-alt"></i>
                </button>
              </div>
              <div class="col-sm-4 col-12 text-center">
                <p class="mb-0 my-2">
                  {{ "TotalRecordsCount" | localize: totalItems }}
                </p>
              </div>
              <div class="col-sm-4 col-12">
                <div class="float-sm-right m-auto">
                  <abp-pagination-controls id="server" (pageChange)="getDataPage($event)">
                  </abp-pagination-controls>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>  
    `,
    listTS: `
    import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  X-ENTITYsServiceProxy,
  X-ENTITYDto,
  X-ENTITYDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { X-ENTITYCreateComponent } from './X-entity-create/X-entity-create.component';
import { X-ENTITYEditComponent } from './X-entity-edit/X-entity-edit.component';

class PagedX-ENTITYsRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './X-entitys.component.html',
  animations: [appModuleAnimation()]
})
export class X-ENTITYsComponent extends PagedListingComponentBase<X-ENTITYDto> {
  X-entitys: X-ENTITYDto[] = [];
  keyword = '';

  constructor(
    injector: Injector,
    private _X-entitysService: X-ENTITYsServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(request: PagedX-ENTITYsRequestDto,pageNumber: number,finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._X-entitysService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: X-ENTITYDtoPagedResultDto) => {
        this.X-entitys = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(X-entity: X-ENTITYDto): void {
    abp.message.confirm(
      this.l('X-ENTITYDeleteWarningMessage', X-entity.id),
      undefined,
      (result: boolean) => {
        if (result) {
          this._X-entitysService
            .delete(X-entity.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => { });
        }
      }
    );
  }

  createX-ENTITY(): void {
    this.showCreateOrEditX-ENTITYDialog();
  }

  editX-ENTITY(X-entity: X-ENTITYDto): void {
    this.showCreateOrEditX-ENTITYDialog(X-entity.id);
  }

  showCreateOrEditX-ENTITYDialog(id?: number): void {
    let createOrEditX-ENTITYDialog: BsModalRef;
    if (!id) {
      createOrEditX-ENTITYDialog = this._modalService.show(
        X-ENTITYCreateComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditX-ENTITYDialog = this._modalService.show(
        X-ENTITYEditComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditX-ENTITYDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}  
    `,
    editHTML: `
<form class="form-horizontal" autocomplete="off" #editForm="ngForm" (ngSubmit)="save()">
    <abp-modal-header [title]="'Edit X-ENTITY' | localize" (onCloseClick)="bsModalRef.hide()"></abp-modal-header>
    <div class="modal-body">
        <tabset>
            <tab [heading]="'Details' | localize" class="pt-3 px-2">

            </tab>
        </tabset>
    </div>
    <abp-modal-footer [cancelDisabled]="saving" [saveDisabled]="!editForm.form.valid || saving"
        (onCancelClick)="bsModalRef.hide()"></abp-modal-footer>
</form>
    `,
    editTS: `
import { Component, Injector, OnInit, EventEmitter, Output } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import * as _ from "lodash";
import { AppComponentBase } from "@shared/app-component-base";
import {
    X-ENTITYsServiceProxy, CreateX-ENTITYDto  
} from "@shared/service-proxies/service-proxies";

@Component({
   templateUrl: "X-entity-edit.component.html",
})
export class X-ENTITYEditComponent extends AppComponentBase implements OnInit {
   saving = false;
   id: number;
   X-entity = new CreateX-ENTITYDto();  

   @Output() onSave = new EventEmitter<any>();

   constructor(
      injector: Injector,
      private _X-entityService: X-ENTITYsServiceProxy,
      public bsModalRef: BsModalRef
   ) {
      super(injector);
   }

   ngOnInit(): void {
      
   }
 

   save(): void {
      this.saving = true;

      const X-entity = new CreateX-ENTITYDto();
      X-entity.init(this.X-entity); 

      this._X-entityService
         .update(X-entity)
         .pipe(
            finalize(() => {
               this.saving = false;
            })
         )
         .subscribe(() => {
            this.notify.info(this.l("SavedSuccessfully"));
            this.bsModalRef.hide();
            this.onSave.emit();
         });
   }
}
    
    `,
    createHTML: `
<form class="form-horizontal" autocomplete="off" #editForm="ngForm" (ngSubmit)="save()">
    <abp-modal-header [title]="'Create X-ENTITY' | localize" (onCloseClick)="bsModalRef.hide()"></abp-modal-header>
    <div class="modal-body">
        <tabset>
            <tab [heading]="'Details' | localize" class="pt-3 px-2">
  
            </tab>
        </tabset>
    </div>
    <abp-modal-footer [cancelDisabled]="saving" [saveDisabled]="!editForm.form.valid || saving"
        (onCancelClick)="bsModalRef.hide()"></abp-modal-footer>
  </form> 
    `,
    createTS: `
    import { Component, Injector, OnInit, EventEmitter, Output } from "@angular/core";
    import { finalize } from "rxjs/operators";
    import { BsModalRef } from "ngx-bootstrap/modal";
    import * as _ from "lodash";
    import { AppComponentBase } from "@shared/app-component-base";
    import { X-ENTITYsServiceProxy,  CreateX-ENTITYDto } from "@shared/service-proxies/service-proxies";
    
    @Component({
       templateUrl: "X-entity-create.component.html",
    })
    export class X-ENTITYCreateComponent extends AppComponentBase implements OnInit {
       saving = false;
       X-entity = new CreateX-ENTITYDto();
     
       @Output() onSave = new EventEmitter<any>();
    
       constructor(
          injector: Injector,
          private _X-entitysService: X-ENTITYsServiceProxy,
          public bsModalRef: BsModalRef
       ) {
          super(injector);
       }
    
       ngOnInit(): void {
           
       }   
    
       save(): void {
          this.saving = true;
    
          const X-entity = new CreateX-ENTITYDto();
          X-entity.init(this.X-entity); 
    
          this._X-entitysService
             .create(X-entity)
             .pipe(
                finalize(() => {
                   this.saving = false;
                })
             )
             .subscribe(() => {
                this.notify.info(this.l("SavedSuccessfully"));
                this.bsModalRef.hide();
                this.onSave.emit();
             });
       }
    } 
    `,
    serverside: {
        entity: `
        using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Timing;
using Abp.UI; 

namespace X-AppName.X-ENTITYs
{
    [Table("X-AppNameX-ENTITYs")]
    public class X-ENTITY : FullAuditedEntity<int>, IMustHaveTenant
    {
        public const int MaxTitleLength = 128; 

        public virtual int TenantId { get; set; }

        [Required]
        [StringLength(MaxTitleLength)]
        public virtual string Title { get; protected set; }
    
         
        protected X-ENTITY()
        {

        }

        public static X-ENTITY Create(int tenantId, string title)
        {
            var X-entity = new X-ENTITY
            { 
                TenantId = tenantId,
                Title = title 
            };  

            return X-entity;
        }
         
    }
}

        `,
        appService: `
        
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.UI; 
using X-AppName.X-ENTITYs;
using X-AppName.Authorization;
using X-AppName.Authorization.Users;
using X-AppName.Events;
using X-AppName.Events.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace X-AppName.X-ENTITYs
{

    [AbpAuthorize(PermissionNames.Pages_X-ENTITYs)]
    public class X-ENTITYsAppService : AsyncCrudAppService<X-ENTITY, X-ENTITYDto,int, PagedAndSortedResultRequestDto, CreateX-ENTITYDto> {
        private readonly IRepository<X-ENTITY, int> _repository;

        public X-ENTITYsAppService(IRepository<X-ENTITY, int> repository) : base(repository)
        {
            _repository = repository;
        }
 
    }
}

        `,
        entityDto: `
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace X-AppName.X-ENTITYs {
    public class X-ENTITYDto : EntityDto<int> {

        [Required]
        [StringLength(256)]
        public string X-ENTITY { get; set; }
    }
}
        
        `,
        createdtos: `
using System.ComponentModel.DataAnnotations; 

namespace X-AppName.X-ENTITYs {
    public class CreateX-ENTITYDto : X-ENTITYDto {
        [Required]
        [StringLength(128)]
        public string Secret { get; set; }
    }
}
        
        `


    }

};