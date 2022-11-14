using AutoMapper;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

using System.Web.Mvc;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/product")]
    public class ProductController : ApiControllerBase
    {
        IProductService _productService;
        public ProductController(IErrorService errorService, IProductService productService) : base(errorService)
        {
            _productService = productService;
        }

        // GET: api/Product
        [Route("getall")]
        public HttpResponseMessage Get(HttpRequestMessage request,string keyword, int page, int pageSize)
        {
            HttpResponseMessage response = null;

            return CreateHttpResponse(request, () =>
            {
                int totalRow = 0;

                var listProduct = _productService.GetAll(keyword);

                totalRow = listProduct.Count();

                var query = listProduct.OrderByDescending(x => x.CreatedDate).Skip(page * pageSize).Take(pageSize);

                var listProductViewModel = Mapper.Map<List<ProductViewModel>>(query);

                var paginationSet = new PaginationSet<ProductViewModel>()
                {
                    Items = listProductViewModel,
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize)
                };

                response = request.CreateResponse(HttpStatusCode.OK, paginationSet);
                return response;
            });
        }
    
    }
}
