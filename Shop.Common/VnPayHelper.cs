using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using Microsoft.AspNetCore.Http;
using Shop.Common.Libraries;
using Shop.Common.Models;

namespace Shop.Common
{
    public class VnPayHelper
    {
        public static string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(ConfigurationManager.AppSettings["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();
            var urlCallBack = ConfigurationManager.AppSettings["ReturnUrl"];

            pay.AddRequestData("vnp_Version", ConfigurationManager.AppSettings["Version"]);
            pay.AddRequestData("vnp_Command", ConfigurationManager.AppSettings["Command"]);
            pay.AddRequestData("vnp_TmnCode", ConfigurationManager.AppSettings["TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", ConfigurationManager.AppSettings["CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", ConfigurationManager.AppSettings["Locale"]);
            pay.AddRequestData("vnp_OrderInfo", $"{model.Name} {model.OrderDescription} {model.Amount}");
            pay.AddRequestData("vnp_OrderType", model.OrderType);
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", tick);

            var paymentUrl =
                pay.CreateRequestUrl(ConfigurationManager.AppSettings["BaseUrl"], ConfigurationManager.AppSettings["HashSecret"]);

            return paymentUrl;
        }

    }
}