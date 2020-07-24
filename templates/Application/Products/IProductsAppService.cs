using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using KM.Products.Dto;

namespace KM.Products
{
    public interface IProductAppService : IAsyncCrudAppService<ProductDto, int, PagedProductResultRequestDto, ProductDto, ProductDto>
    { 

        Task<ProductDto> GetProductForEdit(EntityDto input);

        Task<ListResultDto<ProductListDto>> GetProductsAsync();
    }
}
