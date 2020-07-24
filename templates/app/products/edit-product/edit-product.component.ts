

import { Component, Injector, OnInit, EventEmitter, Output } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import * as _ from "lodash";
import { AppComponentBase } from "@shared/app-component-base";
import {
   ProductServiceProxy, GetProductForEditOutput, ProductDto,  ProductEditDto 
} from "@shared/service-proxies/service-proxies";

@Component({
   templateUrl: "edit-product-dialog.component.html",
})
export class ProductEditComponent extends AppComponentBase implements OnInit {
   saving = false;
   id: number;
   product = new ProductEditDto(); 

   @Output() onSave = new EventEmitter<any>();

   constructor(
      injector: Injector,
      private _productService: ProductServiceProxy,
      public bsModalRef: BsModalRef
   ) {
      super(injector);
   }

   ngOnInit(): void {
      
   }
 

   save(): void {
      this.saving = true;

      const product = new ProductDto();
      product.init(this.product); 

      this._productService
         .update(product)
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
