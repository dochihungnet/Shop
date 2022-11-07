using Shop.Data.Infrastructure;
using Shop.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Data.Repositories
{
    public interface IPostTagRepository : IRepository<PostTag>
    {

    }

    public class PostTagRepository : RepositoryBase<PostTag>, IPostTagRepository
    {
        protected PostTagRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}
