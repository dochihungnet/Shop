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
    [RoutePrefix("api/contact")]
    public class ContactController : ApiControllerBase
    {
        IContactDetailService _contactDetailService;
        public ContactController(IErrorService errorService, IContactDetailService contactDetailService) : base(errorService)
        {
            _contactDetailService = contactDetailService;
        }

        [Route("getcontactdefault")]
        public HttpResponseMessage GetSingleDefaultContact(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var contact = _contactDetailService.GetDefaultContact();

                var contactViewModel = Mapper.Map<ContactDetailViewModel>(contact);

                response = request.CreateResponse(HttpStatusCode.OK, contactViewModel);

                return response;
            });
        }
    }
}