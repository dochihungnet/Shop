using System.Collections.Generic;
using Shop.Data.Infrastructure;
using Shop.Model.Models;

namespace Shop.Data.Repositories
{
    public interface IShoppingCartRepository : IRepository<ShoppingCart>
    {

    }
    public class ShoppingCartRepository : RepositoryBase<ShoppingCart>, IShoppingCartRepository
    {
        public ShoppingCartRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        
        }
    }
}