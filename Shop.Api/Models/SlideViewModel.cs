using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shop.Api.Models
{
    public class SlideViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Url { get; set; }
        public int? DisplayOrder { get; set; }
        public bool Status { get; set; }
        public string Content { get; set; }
    }
}