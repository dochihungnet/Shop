using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Data.Infrastructure
{
    public class DbFactory : Disposable, IDbFactory
    {
        private ShopDbContext context;
        public ShopDbContext Init()
        {
            // nếu context = null thì sẽ khởi tạo context =  new ....
            return context ?? (context = new ShopDbContext());
        }
        public override void DisposeCore()
        {
            if (context != null) context.Dispose();
        }
    }
}
