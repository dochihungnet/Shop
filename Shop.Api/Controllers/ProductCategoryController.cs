using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Model.Models;
using Shop.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/productcategory")]
    //[Authorize]
    public class ProductCategoryController : ApiControllerBase
    {
        IProductCategoryService _productCategoryService;
        public ProductCategoryController(IErrorService errorService, IProductCategoryService productCategoryService) : base(errorService)
        {
            this._productCategoryService = productCategoryService;
        }


        [Route("getallparents")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProductCategory = _productCategoryService.GetAll();

                var listProductCategoryViewModel = Mapper.Map<List<ProductCategoryViewModel>>(listProductCategory);

                response = request.CreateResponse(HttpStatusCode.OK, listProductCategoryViewModel);
                
                return response;
            });
        }
        
        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request, string keyword, int page, int pageSize = 10)
        {
            HttpResponseMessage response = null;
            return CreateHttpResponse(request, () =>
            {
                int totalRow = 0;

                var listProductCategories = _productCategoryService.GetAll(keyword);

                totalRow = listProductCategories.Count();

                var query = listProductCategories.OrderByDescending(x => x.CreatedDate).Skip(page * pageSize).Take(pageSize);

                var listProductViewModel = Mapper.Map<List<ProductCategoryViewModel>>(query);

                var paginationSet = new PaginationSet<ProductCategoryViewModel>()
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

        [Route("getallroot")]
        [HttpGet]
        public HttpResponseMessage GetAllRoot(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProductCategory = _productCategoryService.GetAllRoot();

                var listProductCategoryViewModel = Mapper.Map<List<ProductCategoryViewModel>>(listProductCategory);

                response = request.CreateResponse(HttpStatusCode.OK, listProductCategoryViewModel);

                return response;
            });
        }


        [Route("getbyid/{id:int}")]
        [HttpGet]
        public HttpResponseMessage GetById(HttpRequestMessage request, int id)
        {

            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var productCategory = _productCategoryService.GetById(id);

                var productCategoryViewModel = Mapper.Map<ProductCategoryViewModel>(productCategory);

                response = request.CreateResponse(HttpStatusCode.OK, productCategoryViewModel);

                return response;
            });
        }

        [Route("getallchild")]
        [HttpGet]
        public HttpResponseMessage GetAllByParentId(HttpRequestMessage request, int parentId)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProductCategoryChild = _productCategoryService.GetAllByParentId(parentId);

                var listProductCategoryViewModelChild = Mapper.Map<List<ProductCategoryViewModel>>(listProductCategoryChild);

                response = request.CreateResponse(HttpStatusCode.OK, listProductCategoryViewModelChild);

                return response;
            });
        }

        [Route("getbestselling")]
        [HttpGet]
        public HttpResponseMessage GetProductCategoryBestSelling(HttpRequestMessage request, int amount)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProductCategoryBestSelling = _productCategoryService.GetProductCategoryBestSelling(amount);

                var listProductCategoryViewModelBestSelling = Mapper.Map<List<ProductCategoryViewModel>>(listProductCategoryBestSelling);

                response = request.CreateResponse(HttpStatusCode.OK, listProductCategoryViewModelBestSelling);

                return response;
            });
        }

        [Route("create")]
        [HttpPost]
        public HttpResponseMessage Create(HttpRequestMessage request, ProductCategoryViewModel productCategoryViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var newProductCategory = new ProductCategory();
                newProductCategory = Mapper.Map<ProductCategory>(productCategoryViewModel);
                newProductCategory.CreatedDate = DateTime.Now;
                newProductCategory.CreatedBy = User.Identity.Name;

                newProductCategory = _productCategoryService.Add(newProductCategory);
                _productCategoryService.SaveChanges();

                var newProductCategoryViewModel = Mapper.Map<ProductCategoryViewModel>(newProductCategory);

                response = request.CreateResponse(HttpStatusCode.Created, newProductCategoryViewModel);
                return response;

            });
        }

        [Route("update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, ProductCategoryViewModel productCategoryViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var dbProductCategory = _productCategoryService.GetById(productCategoryViewModel.Id);

                AutoMapper.Mapper.Map(productCategoryViewModel, dbProductCategory);
                dbProductCategory.UpdatedDate = DateTime.Now;
                dbProductCategory.UpdatedBy = User.Identity.Name;

                _productCategoryService.Update(dbProductCategory);
                _productCategoryService.SaveChanges();

                productCategoryViewModel = Mapper.Map<ProductCategoryViewModel>(dbProductCategory);

                response = request.CreateResponse(HttpStatusCode.Created, productCategoryViewModel);

                return response;
            });
        }

        [Route("delete")]
        [HttpDelete]
        public HttpResponseMessage Delete(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var oldProductCategory = _productCategoryService.Delete(id);
                _productCategoryService.SaveChanges();

                var productCategoryViewModel = Mapper.Map<ProductCategoryViewModel>(oldProductCategory);

                response = request.CreateResponse(HttpStatusCode.OK, productCategoryViewModel);
                return response;
            });
        }

        [Route("deletemultiple")]
        [HttpDelete]
        public HttpResponseMessage DeleteMultiple(HttpRequestMessage request, string checkedProductCategories)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProductCategory = new JavaScriptSerializer().Deserialize<List<int>>(checkedProductCategories);

                foreach (var item in listProductCategory)
                {
                    _productCategoryService.Delete(item);
                }
                _productCategoryService.SaveChanges();

                response = request.CreateResponse(HttpStatusCode.OK, listProductCategory.Count);

                return response;
            });
        }
        
 
    
    }
}