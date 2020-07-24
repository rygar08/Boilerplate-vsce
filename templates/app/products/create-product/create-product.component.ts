
import { Component, Injector, OnInit, EventEmitter, Output } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import * as _ from "lodash";
import { AppComponentBase } from "@shared/app-component-base";
import { ProductServiceProxy, ProductDto, CreateProductDto } from "@shared/service-proxies/service-proxies";

@Component({
   templateUrl: "create-product.component.html",
})
export class ProductCreateComponent extends AppComponentBase implements OnInit {
   saving = false;
   product = new ProductDto();
 
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

      const product = new CreateProductDto();
      product.init(this.product); 

      this._productService
         .create(product)
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
