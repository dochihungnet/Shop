using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Shop.Api.Models
{
    public class ProductCategoryViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Yêu cầu nhập tên danh mục.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Yêu cầu phải nhập tiêu đề SEO.")]
        public string Alias { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public int? DisplayOrder { get; set; }
        public string Image { set; get; }
        public bool? HomeFlag { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string MetaKeyword { get; set; }
        public string MetaDescription { get; set; }
        [Required(ErrorMessage = "Yêu cầu nhập trạng thái danh mục.")]
        public bool Status { get; set; }
        public virtual IEnumerable<PostViewModel> Posts { set; get; } // bưu kiện
        public virtual IEnumerable<ProductViewModel> Products { get; set; }
    }
}