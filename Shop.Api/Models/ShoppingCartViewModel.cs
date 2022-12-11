using System;
namespace Shop.Api.Models
{
    public class ShoppingCartViewModel
    {
        public string CustomerId { set; get; }
        public int ProductId { set; get; }
        public int Quantity { set; get; }
        public string Name { get; set; }
        public string Image { get; set; }
        public decimal Price { set; get; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string MetaKeyword { get; set; }
        public string MetaDescription { get; set; }
        public bool Status { get; set; }
    }
}