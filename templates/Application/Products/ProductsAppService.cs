using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using KM.Authorization;
using KM.Authorization.Users;
using KM.Products.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace KM.Products {

    [AbpAuthorize(PermissionNames.Pages_Products)]
    public class ProductAppService : AsyncCrudAppService<Product, ProductDto, int, PagedProductResultRequestDto, ProductDto, ProductDto>, IProductAppService {
        private readonly ProductManager _productManager;
        private readonly UserManager _userManager;

        public ProductAppService(IRepository<Product> repository, ProductManager roleManager, UserManager userManager)
            : base(repository) {
            _productManager = roleManager;
            _userManager = userManager;
        }

        public override async Task<ProductDto> CreateAsync(ProductDto input) {
            CheckCreatePermission();
            var product = ObjectMapper.Map<Product>(input);
            CheckErrors(await _productManager.CreateAsync(product));
            return MapToEntityDto(product);
        }

        public async Task<ListResultDto<ProductListDto>> GetProductsAsync() {
            var products = await _productManager.Products.ToListAsync();
            return new ListResultDto<ProductListDto>(ObjectMapper.Map<List<ProductListDto>>(products));
        } 

        public override async Task<ProductDto> UpdateAsync(ProductDto input) {
            CheckUpdatePermission();
            var product = await _productManager.GetProductByIdAsync(input.Id);
            ObjectMapper.Map(input, product);
            CheckErrors(await _productManager.UpdateAsync(product));
            return MapToEntityDto(product);
        }

        public override async Task DeleteAsync(EntityDto<int> input) {
            CheckDeletePermission();
            var product = await _productManager.FindByIdAsync(input.Id.ToString());
            CheckErrors(await _productManager.DeleteAsync(product));
        }

        protected override IQueryable<Product> CreateFilteredQuery(PagedProductResultRequestDto input) {
            return Repository.GetAllIncluding()
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(input.Keyword)
                || x.Name.Contains(input.Keyword)
                || x.Name.Contains(input.Keyword));
        }

        protected override async Task<Product> GetEntityByIdAsync(int id) {
            return await Repository.GetAllIncluding().FirstOrDefaultAsync(x => x.Id == id);
        }

        protected override IQueryable<Product> ApplySorting(IQueryable<Product> query, PagedProductResultRequestDto input) {
            return query.OrderBy(r => r.Name);
        }

        protected virtual void CheckErrors(IdentityResult identityResult) {
            identityResult.CheckErrors(LocalizationManager);
        }

        public async Task<ProductDto> GetProductForEdit(EntityDto input) {
            var product = await _productManager.GetProductByIdAsync(input.Id);
            var productDto = ObjectMapper.Map<ProductDto>(product);

            return productDto;
        }

     
    }
}

