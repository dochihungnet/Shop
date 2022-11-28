using Shop.Model.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace Shop.Model.Models
{
    [Table("Products")]
    public class Product : Auditable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }

        [Required]
        [MaxLength(256)]
        public string Alias { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int? BrandId { get; set; }

        [MaxLength(256)]
        public string Image { get; set; }

        [Column(TypeName = "xml")]
        public string MoreImages { get; set; }
        public decimal OriginalPrice { set; get; }// giá gốc
        public decimal Price { get; set; } // giá bán
        public decimal? PromotionPrice { get; set; } // giá khuyến mãi == % giảm giá
        public decimal? PriceAfterDiscount { set; get; }
        public DateTime? EndDiscountDate { get; set; } // thời gian kết thúc giảm giá
        public bool? StatusDiscount { get; set; } // trang thái, đang giảm giá hay không
        public int? Warranty { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
        public string Content { get; set; }
        public bool? HomeFlag { get; set; }
        public bool? HotFlag { get; set; }
        public int? ViewCount { get; set; }
        public string Tags { set; get; }
        public int Quantity { set; get; }
        public int? QuantityHasSell { set; get; }

        [ForeignKey("CategoryId")]
        public virtual ProductCategory ProductCategory { set; get; }

        [ForeignKey("BrandId")]
        public virtual Brand Brand { set; get; }
        public virtual IEnumerable<ProductTag> ProductTags { set; get; }

    }
}
