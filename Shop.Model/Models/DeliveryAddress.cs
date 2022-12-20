using Shop.Model.Abstract;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shop.Model.Models
{
    [Table("DeliveryAddress")]
    public class DeliveryAddress : Auditable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(256)]
        public string CustomerName { set; get; }

        [Required]
        [MaxLength(50)]
        public string CustomerMobile { set; get; }
        
        [Required]
        [MaxLength(256)]
        public string CustomerDeliveryAddress { set; get; }
        
        public string CustomerId { set; get; }
        
        [ForeignKey("CustomerId")]
        public virtual ApplicationUser User { set; get; }

    }
}