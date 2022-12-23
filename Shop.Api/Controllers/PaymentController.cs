
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Shop.Api.Infrastructure.Core;
using Shop.Common;
using Shop.Common.Libraries;
using Shop.Common.Models;
using Shop.Service;
using HttpContext = System.Web.HttpContext;

namespace Shop.Api.Controllers
{

    [System.Web.Http.RoutePrefix("api/payment")]
    public class PaymentController : ApiControllerBase
    {
        public PaymentController(IErrorService errorService ) :  base(errorService)
        {

        }
        
        [Route("create")]
        public HttpResponseMessage CreatePaymentUrl(HttpRequestMessage request ,PaymentInformationModel model)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                
                HttpContext context = HttpContext.Current;
                var url = VnPayHelper.CreatePaymentUrl(model, context);

                response = request.CreateResponse(HttpStatusCode.OK, url);
                return response;
            });

        }
    }
}