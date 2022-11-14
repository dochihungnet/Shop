using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shop.Api.Models
{
    public class PageViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Alias { get; set; }
        public string Content { get; set; }
        public bool Status { get; set; }
    }
}