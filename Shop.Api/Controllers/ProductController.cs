﻿using AutoMapper;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Model.Models;
using Shop.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/product")]
    [Authorize]
    public class ProductController : ApiControllerBase
    {
        IProductService _productService;
        public ProductController(IErrorService errorService, IProductService productService) : base(errorService)
        {
            _productService = productService;
        }

        // getbyid/{id:int}
        [Route("getbyid/{id:int}")]
        [HttpGet]
        public HttpResponseMessage GetById(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var product = _productService.GetById(id);

                var productViewModel = Mapper.Map<ProductViewModel>(product);  

                response = request.CreateResponse(HttpStatusCode.OK, productViewModel);

                return response;
            });
        }

        // getbyid/{id:int}
        [Route("getbyidinclude/{id:int}")]
        [HttpGet]
        public HttpResponseMessage GetByIdInclude(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var product = _productService.GetByIdInclude(id);

                var productViewModel = Mapper.Map<ProductViewModel>(product);

                response = request.CreateResponse(HttpStatusCode.OK, productViewModel);

                return response;
            });
        }

        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request) 
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProduct = _productService.GetAll();

                var listProductViewModel = Mapper.Map<List<ProductViewModel>>(listProduct);

                response = request.CreateResponse(HttpStatusCode.OK, listProductViewModel);

                return response;
            });
        }

        // getall
        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request, int page, int pageSize, bool? status = null, int? categoryId = null, int? brandId = null)
        {
            HttpResponseMessage response = null;

            return CreateHttpResponse(request, () =>
            {
                int totalRow = 0;

                var listProduct = status == null ? _productService.GetAll(categoryId, brandId)  : _productService.GetAll(categoryId, brandId, status) ;

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

        // getall
        [Route("getalldealsoftheweek")]
        [HttpGet]
        [AllowAnonymous]
        public HttpResponseMessage GetaAllProductDealsOfTheWeek(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProductDealsOfTheWeek = _productService.GetaAllProductDealsOfTheWeek();

                var listProductViewModelDealsOfTheWeek = Mapper.Map<List<ProductViewModel>>(listProductDealsOfTheWeek);

                response = request.CreateResponse(HttpStatusCode.OK, listProductViewModelDealsOfTheWeek);

                return response;
            });
        }

        // create
        [Route("create")]
        [HttpPost]
        public HttpResponseMessage Create(HttpRequestMessage request, ProductViewModel productViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var newProduct = Mapper.Map<Product>(productViewModel);
                newProduct.QuantityHasSell = 0;
                newProduct.CreatedDate = DateTime.Now;
                newProduct.CreatedBy = User.Identity.Name;


                newProduct = _productService.Add(newProduct);
                _productService.SaveChanges();

                var newProductViewModel = Mapper.Map<ProductViewModel>(newProduct);

                response = request.CreateResponse(HttpStatusCode.Created, newProduct);

                return response;
            });
        }

        // update
        [Route("update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, ProductViewModel productViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var dbProduct = _productService.GetById(productViewModel.Id);

                Mapper.Map(productViewModel, dbProduct);
                dbProduct.UpdatedDate = DateTime.Now;
                dbProduct.UpdatedBy = User.Identity.Name;


                _productService.Update(dbProduct);
                _productService.SaveChanges();

                productViewModel = Mapper.Map<ProductViewModel>(dbProduct);

                response = request.CreateResponse(HttpStatusCode.Created, productViewModel);

                return response;
            });
        }

        
        // delete
        [Route("delete")]
        [HttpDelete]
        public HttpResponseMessage Delete(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var oldProduct = _productService.Delete(id);
                _productService.SaveChanges();

                var productViewModel = Mapper.Map<ProductViewModel>(oldProduct);

                response = request.CreateResponse(HttpStatusCode.OK, productViewModel);

                return response;
            });
        }

        // deletemultiple
        [Route("deletemultiple")]
        [HttpDelete]
        public HttpResponseMessage DeleteMulti(HttpRequestMessage request, string checkedProducts)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listProductId = new JavaScriptSerializer().Deserialize<List<int>>(checkedProducts);

                foreach (var productId in listProductId)
                {
                    _productService.Delete(productId);
                }
                _productService.SaveChanges();

                response = request.CreateResponse(HttpStatusCode.OK, listProductId.Count());

                return response;
            });
        }
    }
}
