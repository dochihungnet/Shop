using Shop.Data.Infrastructure;
using Shop.Data.Repositories;
using Shop.Model.Models;
using System.Collections.Generic;
using System.Linq;

namespace Shop.Service
{
    public interface IProductCategoryService
    {
        ProductCategory Add(ProductCategory productCategory);
        void Update(ProductCategory productCategory);
        ProductCategory Delete(ProductCategory productCategory);
        ProductCategory Delete(int id);
        IEnumerable<ProductCategory> GetAll();
        IEnumerable<ProductCategory> GetAllRoot();
        IEnumerable<ProductCategory> GetAll(string keyword);
        List<ProductCategory> GetProductCategoryBestSelling(int amount);
        IEnumerable<ProductCategory> GetAllByParentId(int parrentId);
        ProductCategory GetById(int id);
        void SaveChanges();
    }
    public class ProductCategoryService : IProductCategoryService
    {
        private IProductCategoryRepository _productCategoryRepository;
        private IProductRepository _productRepository;
        private IUnitOfWork _unitOfWork;

        public ProductCategoryService(IProductCategoryRepository productCategoryRepository, IProductRepository productRepository, IUnitOfWork unitOfWork)
        {
            this._productCategoryRepository = productCategoryRepository;
            this._productRepository = productRepository;
            this._unitOfWork = unitOfWork;
        }

        public ProductCategory Add(ProductCategory productCategory)
        {
            return _productCategoryRepository.Add(productCategory);
        }

        public ProductCategory Delete(ProductCategory productCategory)
        {
            return _productCategoryRepository.Delete(productCategory);
        }

        public ProductCategory Delete(int id)
        {
            return _productCategoryRepository.Delete(id);
        }

        public IEnumerable<ProductCategory> GetAll()
        {
            return _productCategoryRepository.GetAll();
        }

        public IEnumerable<ProductCategory> GetAllRoot()
        {
            return _productCategoryRepository.GetMulti(x => x.ParentId == null && x.Status);
        }
        public IEnumerable<ProductCategory> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return _productCategoryRepository.GetMulti(x => x.Name.Contains(keyword) || x.Description.Contains(keyword));
            }
            return _productCategoryRepository.GetAll();
        }

        public IEnumerable<ProductCategory> GetAllByParentId(int parrentId)
        {
            return _productCategoryRepository.GetMulti(x => x.Status && x.ParentId == parrentId);
        }

        public ProductCategory GetById(int id)
        {
            return _productCategoryRepository.GetSingleById(id);
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public void Update(ProductCategory productCategory)
        {
            _productCategoryRepository.Update(productCategory);
        }

        public List<ProductCategory> GetProductCategoryBestSelling(int amount)
        {
            var listProductCategory = _productCategoryRepository.GetAll().ToList();

            listProductCategory.Sort((x, y) =>
            {
                var listProductByCate_x = _productRepository.GetMulti(p => p.CategoryId == x.Id);
                var listProductByCate_y = _productRepository.GetMulti(p => p.CategoryId == y.Id);
                var sum_x = listProductByCate_x.Sum(p => (int)p.QuantityHasSell);
                var sum_y = listProductByCate_y.Sum(p => (int)p.QuantityHasSell);

                return sum_y - sum_x;
            });
            if(listProductCategory.Count < amount)
            {
                listProductCategory.GetRange(0, listProductCategory.Count);
            }
            return listProductCategory.GetRange(0, amount);
        }
    }
}
