using Shop.Data.Infrastructure;
using Shop.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Data.Repositories
{
    public interface ISlideGroupRepository : IRepository<SlideGroup>
    {

    }
    public class SlideGroupRepository : RepositoryBase<SlideGroup>, ISlideGroupRepository
    {
        public SlideGroupRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}
