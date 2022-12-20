using System;
using System.ComponentModel.DataAnnotations;
using Shop.Model.Models;

namespace Shop.Api.Models
{
    public class DeliveryAddressViewModel
    {

        public int Id { get; set; }

        public string CustomerName { set; get; }
        
        public string CustomerMobile { set; get; }

        public string CustomerDeliveryAddress { set; get; }
        
        public string CustomerId { set; get; }
        
        public virtual ApplicationUser User { set; get; }
        
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string MetaKeyword { get; set; }
        public string MetaDescription { get; set; }
        public bool Status { get; set; }
    }
}