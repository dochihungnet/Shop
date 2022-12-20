using Shop.Data.Infrastructure;
using Shop.Model.Models;

namespace Shop.Data.Repositories
{
    public interface IDeliveryAddressRepository : IRepository<DeliveryAddress>
    {
        
    }
    public class DeliveryAddressRepository : RepositoryBase<DeliveryAddress>, IDeliveryAddressRepository
    {
        public DeliveryAddressRepository(IDbFactory dbFactory) : base(dbFactory)
        {
            
        }
    }
}