using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shop.Api.Models
{
    public class PostCategoryViewModel
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public string Alias { set; get; }
        public string Description { set; get; }
        public int? ParentId { set; get; }
        public int? DisplayOrder { set; get; }
        public string Image { set; get; }
        public bool? HomeFlag { set; get; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string MetaKeyword { get; set; }
        public string MetaDescription { get; set; }
        public bool Status { get; set; }
        public virtual IEnumerable<PostViewModel> Posts { set; get; }
    }
}