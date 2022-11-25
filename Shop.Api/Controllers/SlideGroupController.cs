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
    [RoutePrefix("api/slidegroup")]
    public class SlideGroupController : ApiControllerBase
    {
        ISlideGroupService _slideGroupService;
        public SlideGroupController(IErrorService errorService, ISlideGroupService slideGroupService) : base(errorService)
        {
            this._slideGroupService = slideGroupService;
        }

        [Route("getall")]
        [HttpGet]
        public HttpResponseMessage GetAll(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listSlideGroup = _slideGroupService.GetAll();

                var listSlideGroupViewModel = Mapper.Map<List<SlideGroupViewModel>>(listSlideGroup);

                response = request.CreateResponse(HttpStatusCode.OK, listSlideGroupViewModel);

                return response;
            });
        }
    }
}