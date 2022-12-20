using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Model.Models
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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

        public string PaymentMethod { set; get; } //bỏ qua

        public DateTime? CreatedDate { set; get; }
        
        public string CreatedBy { set; get; }
        
        // true: đã thanh toán
        // false: chưa thanh toán
        public bool PaymentStatus { set; get; }
        
        // 1: Chưa duyệt
        // 2: Đã duyệt
        // 3: Đang gói hàng
        // 4: Đang vận chuyển
        // 5: Đã giao hàng
        public int? OrderStatus { set; get; }
        public decimal? TransportFee { set; get; }
        public float? Vat { set; get; }

        // trạng thái
        public bool Status { set; get; }

        [StringLength(128)]
        [Column(TypeName = "nvarchar")]
        public string CustomerId { set; get; }

        [ForeignKey("CustomerId")]
        public virtual ApplicationUser User { set; get; }
        public ICollection<OrderDetail> OrderDetails { set; get; }
    }
}
