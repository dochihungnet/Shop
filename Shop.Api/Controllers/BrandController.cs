using AutoMapper;
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
    [RoutePrefix("api/brand")]
    public class BrandController : ApiControllerBase
    {
        IBrandService _brandService;
        public BrandController(IErrorService errorService, IBrandService brandService) : base(errorService)
        {
            this._brandService = brandService;
        }

        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listBrand = _brandService.GetAll();

                var listBrandViewModel = Mapper.Map<List<BrandViewModel>>(listBrand);

                response = request.CreateResponse(HttpStatusCode.OK, listBrandViewModel);

                return response;
            });
        }

        [Route("getall")]
        public HttpResponseMessage GetAll(HttpRequestMessage request, string keyword, int page, int pageSize)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                int totalRow = 0;

                var listBrand = _brandService.GetAll(keyword);

                totalRow = listBrand.Count();

                var query = listBrand.OrderByDescending(x => x.CreatedDate).Skip(page * pageSize).Take(pageSize);

                var listBrandViewModel = Mapper.Map<List<BrandViewModel>>(query);

                var paginationSet = new PaginationSet<BrandViewModel>()
                {
                    Items = listBrandViewModel,
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize)
                };

                response = request.CreateResponse(HttpStatusCode.OK, paginationSet);

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

                var brand = _brandService.GetById(id);

                var bradViewModel = Mapper.Map<BrandViewModel>(brand);

                response = request.CreateResponse(HttpStatusCode.OK, bradViewModel);

                return response;
            });
        }

        [Route("create")]
        [HttpPost]
        public HttpResponseMessage Create(HttpRequestMessage request, BrandViewModel brandViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var newBrand = new Brand();
                newBrand = Mapper.Map<Brand>(brandViewModel);
                newBrand.CreatedDate = DateTime.Now;
                newBrand.CreatedBy = "admin";

                newBrand =  _brandService.Add(newBrand);
                _brandService.SaveChanges();

                var newBrandViewModel = Mapper.Map<BrandViewModel>(newBrand);

                response = request.CreateResponse(HttpStatusCode.Created, newBrandViewModel);

                return response;
            });
        }

        [Route("update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, BrandViewModel brandViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var dbBrand = _brandService.GetById(brandViewModel.Id);
                Mapper.Map(brandViewModel, dbBrand);
                dbBrand.UpdatedDate = DateTime.Now;
                dbBrand.UpdatedBy = "admin";

                _brandService.Update(dbBrand);
                _brandService.SaveChanges();

                brandViewModel = Mapper.Map<BrandViewModel>(dbBrand);
                response = request.CreateResponse(HttpStatusCode.Created, brandViewModel);

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

                var oldBrand = _brandService.Delete(id);
                _brandService.SaveChanges();

                var brandViewModel = Mapper.Map<ProductCategoryViewModel>(oldBrand);

                response = request.CreateResponse(HttpStatusCode.OK, brandViewModel);

                return response;
            });
        }

        [Route("deletemultiple")]
        [HttpDelete]
        public HttpResponseMessage DeleteMultiple(HttpRequestMessage request, string checkedBrands)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listBrand = new JavaScriptSerializer().Deserialize<List<int>>(checkedBrands);

                foreach (var item in listBrand)
                {
                    _brandService.Delete(item);
                }
                _brandService.SaveChanges();

                response = request.CreateResponse(HttpStatusCode.OK, listBrand.Count);

                return response;
            });
        }
    }
}