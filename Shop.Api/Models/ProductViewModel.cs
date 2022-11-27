using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shop.Api.Models
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Alias { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public string Image { get; set; }
        public string MoreImages { get; set; }
        public int? Warranty { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public bool? HomeFlag { get; set; }
        public bool? HotFlag { get; set; }
        public int? ViewCount { get; set; }
        public string Tags { set; get; }
        public int Quantity { set; get; }
        public int? QuantityHasSell { set; get; }
        public decimal OriginalPrice { set; get; }// giá gốc
        public decimal Price { get; set; } // giá bán
        public decimal? PromotionPrice { get; set; } // giá khuyến mãi == % giảm giá
        public decimal? PriceAfterDiscount { set; get; }
        public DateTime? EndDiscountcDate { get; set; } // thời gian kết thúc giảm giá
        public bool? StatusDiscount { get; set; } // trang thái, đang giảm giá hay không
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string MetaKeyword { get; set; }
        public string MetaDescription { get; set; }
        public bool Status { get; set; }
        public virtual ProductCategoryViewModel ProductCategory { set; get; }
        public virtual BrandViewModel Brand { set; get; }
        public virtual IEnumerable<ProductTagViewModel> ProductTags { set; get; }
    }
}