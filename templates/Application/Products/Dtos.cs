using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using AutoMapper;

namespace KM.Products.Dto
{
    public class ProductDto : EntityDto<int>
    {
        [Required]
        [StringLength(Product.MaxNameLength)]
        public string Name { get; set; }  
        
        [Required]
        public int Quantity { get; set; } 
    }  
 

    public class PagedProductResultRequestDto : PagedResultRequestDto {
        public string Keyword { get; set; }
    } 

    public class ProductListDto : EntityDto, IHasCreationTime {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool IsStatic { get; set; }

        public bool IsDefault { get; set; }

        public DateTime CreationTime { get; set; }
    }

    public class ProductMapProfile : Profile {
        public ProductMapProfile() {
            // Product  

            CreateMap<ProductDto, Product>(); 
            CreateMap<ProductDto, Product>(); 
            //CreateMap<ProductBase, ProductDto>().ForMember(x => x.GrantedPermissions,
            //    opt => opt.MapFrom(x => x.Permissions.Where(p => p.IsGranted)));

            CreateMap<Product, ProductListDto>();
            CreateMap<Product, ProductDto>(); 
        }
    }
}