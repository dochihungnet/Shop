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
    [RoutePrefix("api/tag")]
    public class TagController : ApiControllerBase
    {
        ITagService _tagService;
        public TagController(IErrorService errorService, ITagService tagService) : base(errorService)
        {
            _tagService = tagService;
        }

        // getbyid/{id:int}
        [Route("getbyid/{id}")]
        [HttpGet]
        public HttpResponseMessage GetTagById(HttpRequestMessage request, string id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var tag = _tagService.GetTagById(id);

                var tagViewModel = Mapper.Map<TagViewModel>(tag);

                response = request.CreateResponse(HttpStatusCode.OK, tagViewModel);

                return response;
            });
        }

    }
}