using Shop.Data.Infrastructure;
using Shop.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Data.Repositories
{
    public interface IProductCategoryReopository : IRepository<ProductCategory>
    {
    }

    public class ProductCategoryReopository : RepositoryBase<ProductCategory>, IProductCategoryReopository
    {
        protected ProductCategoryReopository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}
