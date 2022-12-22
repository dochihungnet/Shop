using Shop.Model.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Shop.Api.Models
{
    public class OrderDetailViewModel
    {
        public int OrderId { set; get; }

        public int ProductId { set; get; }

        public int Quantity { set; get; }

        public decimal Price { set; get; }
        
        public Product Product { set; get; }
    }
}