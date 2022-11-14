using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shop.Api.Models
{
    public class FooterViewModel
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public bool? Status { get; set; }
    }
}