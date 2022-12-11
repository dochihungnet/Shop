using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Shop.Model.Abstract;

namespace Shop.Model.Models
{
    public class ShoppingCart : Auditable
    {
        [Key]
        [Column(Order = 1)]
        public string CustomerId{ set; get; }
        
        [Key]
        [Column(Order = 2)]
        public int ProductId { set; get; }
        public string Name { get; set; }
        public string Image { get; set; }
        public int Quantity { set; get; }
        public decimal Price { set; get; }
        
        [ForeignKey("ProductId")]
        public virtual Product Product { set; get; }

        [ForeignKey("CustomerId")]
        public virtual ApplicationUser User { set; get; }
    }
}