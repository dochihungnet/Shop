using Shop.Data.Infrastructure;
using Shop.Model.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Data.Repositories
{
    public interface IOrderRepository : IRepository<Order>
    {
        Order GetOrderById(int orderId);
    }
    public class OrderRepository : RepositoryBase<Order>, IOrderRepository
    {
        public OrderRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }

        public Order GetOrderById(int orderId)
        {
            return DbContext.Orders.Include(x => x.OrderDetails.Select(s => s.Product)).FirstOrDefault(y => y.Id == orderId);
        }
    }
}
