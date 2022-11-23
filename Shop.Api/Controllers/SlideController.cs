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
    [RoutePrefix("api/slide")]
    public class SlideController : ApiControllerBase
    {
        ISlideService _slideService;
        public SlideController(IErrorService errorService, ISlideService slideService) : base(errorService)
        {
            this._slideService = slideService;
        }

        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listSlide = _slideService.GetAll();

                var listSlideViewModel = Mapper.Map<List<SlideViewModel>>(listSlide);

                response = request.CreateResponse(HttpStatusCode.OK, listSlideViewModel);

                return response;
            });
        }

        [Route("getall")]
        public HttpResponseMessage GetAll(HttpRequestMessage request, int page, int pageSize, bool? status = null)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                int totalRow = 0;

                var listSlide = status == null ?  _slideService.GetAll() : _slideService.GetAll(status);

                totalRow = listSlide.Count();

                var query = listSlide.OrderByDescending(x => x.DisplayOrder).Skip(page * pageSize).Take(pageSize);

                var listSlideViewModel = Mapper.Map<List<SlideViewModel>>(query);

                var paginationSet = new PaginationSet<SlideViewModel>()
                {
                    Items = listSlideViewModel,
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

                var slide = _slideService.GetById(id);

                var slideViewModel = Mapper.Map<SlideViewModel>(slide);

                response = request.CreateResponse(HttpStatusCode.OK, slideViewModel);

                return response;
            });
        }

        [Route("create")]
        [HttpPost]
        public HttpResponseMessage Create(HttpRequestMessage request, SlideViewModel slideViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var newSlide = new Slide();
                newSlide = Mapper.Map<Slide>(slideViewModel);

                newSlide = _slideService.Add(newSlide);
                _slideService.SaveChanges();

                var newSlideViewModel = Mapper.Map<SlideViewModel>(newSlide);

                response = request.CreateResponse(HttpStatusCode.Created, newSlideViewModel);

                return response;
            });
        }

        [Route("update")]
        [HttpPut]
        public HttpResponseMessage Update(HttpRequestMessage request, SlideViewModel slideViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
                    return response;
                }

                var dbSlide = _slideService.GetById(slideViewModel.Id);
                Mapper.Map(slideViewModel, dbSlide);

                _slideService.Update(dbSlide);
                _slideService.SaveChanges();

                slideViewModel = Mapper.Map<SlideViewModel>(dbSlide);
                response = request.CreateResponse(HttpStatusCode.Created, slideViewModel);

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

                var oldSlide = _slideService.Delete(id);
                _slideService.SaveChanges();

                var slideViewModel = Mapper.Map<SlideViewModel>(oldSlide);

                response = request.CreateResponse(HttpStatusCode.OK, slideViewModel);

                return response;
            });
        }

        [Route("deletemultiple")]
        [HttpDelete]
        public HttpResponseMessage DeleteMultiple(HttpRequestMessage request, string checkedSlides)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listSlide = new JavaScriptSerializer().Deserialize<List<int>>(checkedSlides);

                foreach (var item in listSlide)
                {
                    _slideService.Delete(item);
                }
                _slideService.SaveChanges();

                response = request.CreateResponse(HttpStatusCode.OK, listSlide.Count);

                return response;
            });
        }
    }
}