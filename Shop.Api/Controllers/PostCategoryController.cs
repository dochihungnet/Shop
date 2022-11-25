using AutoMapper;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Shop.Api.Controllers
{
    [RoutePrefix("api/postcategory")]
    public class PostCategoryController : ApiControllerBase
    {
        IPostCategoryService _postCategoryService;

        public PostCategoryController(IErrorService errorService, IPostCategoryService postCategoryService) : base(errorService)
        {
            this._postCategoryService = postCategoryService;
        }

        [Route("getallparents")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listPostCategory = _postCategoryService.GetAll();

                var listPostCategoryViewModel = Mapper.Map<List<PostCategoryViewModel>>(listPostCategory);

                response = request.CreateResponse(HttpStatusCode.OK, listPostCategoryViewModel);

                return response;
            });
        }

        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request, string keyword, string page, string pageSize)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;




                return response;
            });
        }
    }
}