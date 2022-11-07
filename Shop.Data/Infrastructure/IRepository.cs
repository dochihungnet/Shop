using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Data.Infrastructure
{
    public interface IRepository<T> where T : class
    {
        // Marks an entity as new
        // Đánh dấu 1 thực thể là mới
        T Add(T entity);

        // Marks an entity as modified
        // Đánh dấu 1 thực thể là đã sửa đổi
        void Update(T entity);

        // Marks an entity as removed
        // Đánh dấu 1 thực thể là đã xóa
        T Delete(T entity);
        T Delete(int id);

        // Delete multi records
        // Xóa nhiều bản ghi
        void DeleteMulti(Expression<Func<T, bool>> where);

        // Get an entity by id
        T GetSingleById(int id);

        // expression: biểu hiện
        // include: bao gồm
        T GetSingleByCondition(Expression<Func<T, bool>> expression, string[] includes = null);

        IEnumerable<T> GetAll(string[] include = null);

        // predicate: thuộc tính
        IEnumerable<T> GetMulti(Expression<Func<T, bool>> predicate, string[] includes = null);

        IEnumerable<T> GetMultiPaging(Expression<Func<T, bool>> filter, out int total, int index = 0, int size = 50, string[] includes = null);

        int Count(Expression<Func<T, bool>> where);

        bool CheckContains(Expression<Func<T, bool>> predicate);
    }
}
