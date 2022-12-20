using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Shop.Api.Models
{
    public class OrderViewModel
    {
        public int Id { set; get; }

        [Required]
        [MaxLength(256)]
        public string CustomerName { set; get; }

        [Required]
        [MaxLength(256)]
        public string CustomerDeliveryAddress { set; get; }

        [Required]
        [MaxLength(256)]
        public string CustomerEmail { set; get; }

        [Required]
        [MaxLength(50)]
        public string CustomerMobile { set; get; }

        public string CustomerMessage { set; get; }

        public string PaymentMethod { set; get; } // phương thức thanh toán
        public DateTime? CreatedDate { set; get; }
        public string CreatedBy { set; get; }
        public int? OrderStatus { set; get; } // trạng thái đơn hàng, chưa duyệt, đã duyệt,
        public bool PaymentStatus { set; get; } // đã thanh toán hay chưa
        public decimal? TransportFee { set; get; }
        public float? Vat { set; get; }
        public bool Status { set; get; }

        [StringLength(128)]
        public string CustomerId { set; get; }
        
        public IEnumerable<OrderDetailViewModel> OrderDetails { set; get; }
    }
}