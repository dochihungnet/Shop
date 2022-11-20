using Shop.Common;
using Shop.Data.Infrastructure;
using Shop.Data.Repositories;
using Shop.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Service
{
    public interface IProductService
    {
        Product Add(Product product);
        void Update(Product product);
        Product Delete(Product product);
        Product Delete(int id);
        IEnumerable<Product> GetAll();
        IEnumerable<Product> GetAll(string keyword);
        IEnumerable<Product> GetAll(int? categoryId, int? brandId);
        IEnumerable<Product> GetAll(int? categoryId, int? brandId, bool? status);

        IEnumerable<Product> GetFeatured(int top);
        IEnumerable<Product> GetHotProduct(int top);
        IEnumerable<Product> GetOnSaleProduct(int top);
        IEnumerable<Product> GetListProductByCategoryIdPaging(int categoryId, int page, int pageSize, string sort, out int totalRow);
        IEnumerable<Product> GetReatedProducts(int id, int top);
        IEnumerable<Product> GetListProductByName(string name);
        Product GetById(int id);
        IEnumerable<Tag> GetListTagByProductId(int id);
        void IncreaseView(int id);
        IEnumerable<Product> GetListProductByTag(string tagId, int page, int pageSize, out int totalRow);

        Tag GetTag(string tagId);
        void SaveChanges();
    }
    public class ProductService : IProductService
    {
        IProductRepository _productRepository;
        IProductTagRepository _productTagRepository;
        ITagRepository _tagRepository;
        IUnitOfWork _unitOfWork;
        public ProductService(IProductRepository productRepository, IProductTagRepository productTagRepository, ITagRepository tagRepository, IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _productTagRepository = productTagRepository;
            _tagRepository = tagRepository;
            _unitOfWork = unitOfWork;
        }

        public Product Add(Product product)
        {
            var productSave = _productRepository.Add(product);
            _unitOfWork.Commit();

            if (!string.IsNullOrEmpty(product.Tags))
            {
                string[] tags = product.Tags.Split(',');
                for(int i = 0; i < tags.Length; i++)
                {
                    var tagId = StringHelper.ToUnsignString(tags[i]);
                    if (_tagRepository.CheckContains(t => t.Id == tagId))
                    {
                        Tag tag = new Tag()
                        {
                            Id = tagId,
                            Name = tags[i],
                            Type = CommonConstants.ProductTag
                        };

                        _tagRepository.Add(tag);
                    }

                    ProductTag productTag = new ProductTag()
                    {
                        ProductId = productSave.Id,
                        TagId = tagId,
                    };

                    _productTagRepository.Add(productTag);
                }
                _unitOfWork.Commit();
            }

           return productSave;
        }

        public Product Delete(Product product)
        {
           return _productRepository.Delete(product);
        }

        public Product Delete(int id)
        {
            return _productRepository.Delete(id);
        }

        public IEnumerable<Product> GetAll()
        {
            return _productRepository.GetAll();
        }

        public IEnumerable<Product> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return _productRepository.GetMulti(x => x.Name.Contains(keyword) || x.Description.Contains(keyword));
            }
            return _productRepository.GetAll();
        }

        public IEnumerable<Product> GetAll(int? categoryId, int? brandId)
        {
           
            if(categoryId.HasValue && brandId.HasValue)
            {
                return _productRepository.GetMulti(x => x.BrandId == brandId.Value && x.CategoryId == categoryId.Value);
            }
            else if(categoryId.HasValue && !brandId.HasValue)
            {
                return _productRepository.GetMulti(x => x.CategoryId == categoryId.Value);
            }
            else if(brandId.HasValue && !categoryId.HasValue)
            {
                return _productRepository.GetMulti(x => x.BrandId == brandId.Value);
            }
            else
            {
                return _productRepository.GetAll();
            }
            
        }

        public IEnumerable<Product> GetAll(int? categoryId, int? brandId, bool? status)
        {
            return GetAll(categoryId, brandId).Where(x => x.Status == status);
        }

        public Product GetById(int id)
        {
            return _productRepository.GetSingleById(id);
        }

        public IEnumerable<Product> GetFeatured(int top)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetHotProduct(int top)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetListProductByCategoryIdPaging(int categoryId, int page, int pageSize, string sort, out int totalRow)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetListProductByName(string name)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetListProductByTag(string tagId, int page, int pageSize, out int totalRow)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Tag> GetListTagByProductId(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetOnSaleProduct(int top)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetReatedProducts(int id, int top)
        {
            throw new NotImplementedException();
        }

        public Tag GetTag(string tagId)
        {
            throw new NotImplementedException();
        }

        public void IncreaseView(int id)
        {
            throw new NotImplementedException();
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public void Update(Product product)
        {
            _productRepository.Update(product);

            if (!string.IsNullOrEmpty(product.Tags))
            {
                string[] tags = product.Tags.Split(',');
                for(int i = 0; i < tags.Length; i++)
                {
                    if (!string.IsNullOrEmpty(product.Tags))
                    {
                        var tagId  = StringHelper.ToUnsignString(product.Tags);
                        if(!_tagRepository.CheckContains(x => x.Id == tagId))
                        {
                            Tag tag = new Tag()
                            {
                                Id = tagId,
                                Name = tags[i],
                                Type = CommonConstants.ProductTag
                            };

                            _tagRepository.Add(tag);
                        }
                    }

                }
                _unitOfWork.Commit();
            }

        }
    }
}
