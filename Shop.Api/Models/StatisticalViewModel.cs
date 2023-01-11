using System.Collections.Generic;
using Shop.Model.Models;

namespace Shop.Api.Models
{
    public class StatisticalViewModel
    {
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalCustomer { get; set; }
        public List<ProductCategoryViewModel> TopProductCategoryViewModels { get; set; } // top 10 danh mục sản phẩm
        public List<ProductViewModel> TopProductViewModels { get; set; } // top 10 sản phẩm bán chạy nhất
        public List<ApplicationUser> TopUsers { get; set; } // top 10 user mua nhiều
        public List<OrderViewModel> RecentOrders { get; set; } // những đơn hàng gần đây
    }
}