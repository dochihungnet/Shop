using Microsoft.AspNet.Identity.Owin;
using Shop.Api.App_Start;
using Shop.Api.Infrastructure.Core;
using Shop.Api.Models;
using Shop.Model.Models;
using Shop.Service;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Microsoft.AspNet.Identity;


namespace Shop.Api.Controllers
{
    [RoutePrefix("api/delivery-address")]
    public class DeliveryAddressController : ApiControllerBase
    {
        private IDeliveryAddressService _deliveryAddressService;
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public DeliveryAddressController(IErrorService errorService, IDeliveryAddressService deliveryAddressService, ApplicationUserManager userManager, ApplicationSignInManager signInManager) : base(errorService)
        {
            _deliveryAddressService = deliveryAddressService;
            UserManager = userManager;
            SignInManager = signInManager;
        }
        
        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        [Route("add-delivery-address")]
        [HttpPost]
        public HttpResponseMessage AddDeliveryAddress(HttpRequestMessage request,
            DeliveryAddressViewModel deliveryAddressViewModel)
        {
            
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.OK, false);
                    return response;
                }
                
                var deliveryAddress = Mapper.Map<DeliveryAddress>(deliveryAddressViewModel);
                deliveryAddress.CreatedBy = User.Identity.Name;
                deliveryAddress.CreatedDate = DateTime.Now;

                var deliveryAddressNew = _deliveryAddressService.Add(deliveryAddress);
                _deliveryAddressService.SaveChanges();
                
                var userById =  _userManager.FindById(deliveryAddress.CustomerId);
                if (!userById.DeliveryAddressDefault.HasValue)
                {
                    userById.DeliveryAddressDefault = deliveryAddressNew.Id;
                    _userManager.Update(userById);
                }

                var delivaryAddressNewViewModel = Mapper.Map<DeliveryAddress>(deliveryAddressNew);
                
                response = request.CreateResponse(HttpStatusCode.OK, delivaryAddressNewViewModel);
                return response;
            
        }

        [Route("update-delivery-address")]
        [HttpPut]
        public HttpResponseMessage UpdateDeliveryAddress(HttpRequestMessage request,
            DeliveryAddressViewModel deliveryAddressViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage respose = null;

                if (!ModelState.IsValid)
                {
                    respose = request.CreateResponse(HttpStatusCode.OK, false);
                    return respose;
                }

                var deliveryAddress = Mapper.Map<DeliveryAddress>(deliveryAddressViewModel);
                deliveryAddress.UpdatedBy = User.Identity.Name;
                deliveryAddress.UpdatedDate = DateTime.Now;

                _deliveryAddressService.Update(deliveryAddress);
                _deliveryAddressService.SaveChanges();

                respose = request.CreateResponse(HttpStatusCode.OK, true);
                return respose;
            });
        }

        [Route("get-all-by-user-id")]
        [HttpGet]
        public HttpResponseMessage GetAllByUserId(HttpRequestMessage request, string userId)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var listDeliveryAddress = _deliveryAddressService.GetAllByUserId(userId);

                var listDeliveryAddressViewModel = Mapper.Map<List<DeliveryAddressViewModel>>(listDeliveryAddress);

                response = request.CreateResponse(HttpStatusCode.OK, listDeliveryAddressViewModel);
                
                return response;
            });
        }

        [Route("get-by-id")]
        [HttpGet]
        public HttpResponseMessage GetById(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var deliveryAddress = _deliveryAddressService.GetById(id);

                var deliveryAddressViewModel = Mapper.Map<DeliveryAddressViewModel>(deliveryAddress);

                response = request.CreateResponse(HttpStatusCode.OK, deliveryAddressViewModel);
                
                return response;
            });
        }

        [Route("set-delivery-address-default")]
        [HttpPut]
        public HttpResponseMessage SetDeliveryAddressDefault(HttpRequestMessage request, DeliveryAddressViewModel deliveryAddressViewModel)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                
                var userById =  _userManager.FindById(deliveryAddressViewModel.CustomerId);
                userById.DeliveryAddressDefault = deliveryAddressViewModel.Id;
                _userManager.Update(userById);

                response = request.CreateResponse(HttpStatusCode.OK, true);
                return response;
            });
        }
    }
}