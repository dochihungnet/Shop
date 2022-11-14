using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Shop.Api.Infrastructure.Core
{
    public class PaginationSet<T> where T : class
    {
        public int Page { set; get; }
        public int Count
        {
            get { return (Items != null ? Items.Count() : 0); }
        }
        public int TotalPages { get; set; } // tổng trang
        public int TotalCount { get; set; } // tổng số

        public int MaxPage { set; get; } // max trang
        public IEnumerable<T> Items { get; set; }
    }
}