using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Data.Infrastructure
{
    public class Disposable : IDisposable
    {
        public bool IsDisposed;
        ~Disposable()
        {
            Dispose(false);
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Dispose(bool disposing)
        {
            if (!IsDisposed && disposing)
            {
                DisposeCore();
            }
            IsDisposed = true;
        }

        // Overide this to dispose custom object
        // Ghi đè điều này để hủy đối tượng tùy chỉnh
        public virtual void DisposeCore()
        {

        }
    }
}
