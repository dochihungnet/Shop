using Shop.Model.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

        [NotMapped]
        public XElement MoreImagesDetail
        {
            get { return MoreImages != null ? XElement.Parse(MoreImages) : null; }
            set { MoreImages = value.ToString(); }
        }
        public decimal Price { get; set; }
        public decimal? PromotionPrice { get; set; } // giá khuyến mãi
        public int? Warranty { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
        public string Content { get; set; }
        public bool? HomeFlag { get; set; }
        public bool? HotFlag { get; set; }
        public int? ViewCount { get; set; }
        public string Tags { set; get; }
        public int Quantity { set; get; }
        public decimal OriginalPrice { set; get; }// giá gốc

        [ForeignKey("CategoryId")]
        public virtual ProductCategory ProductCategory { set; get; }

        [ForeignKey("BrandId")]
        public virtual Brand Brand { set; get; }
        public virtual IEnumerable<ProductTag> ProductTags { set; get; }

    }
}
