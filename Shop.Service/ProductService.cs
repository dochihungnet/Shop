﻿using Shop.Common;
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
        IEnumerable<Product> GetAll(string keyword, decimal minPrice, decimal maxPrice, int? categoryId, int? brandId, int sortBy);
        IEnumerable<Product> GetAllProductDealsOfTheWeek();
        IEnumerable<Product> GetAllProductBestSellingByCategoryId(int categoryId, int size);
        IEnumerable<Product> GetListProductByName(string name);
        IEnumerable<Product> GetListBestSeller(int size);
        IEnumerable<Product> GetListNew(int size);
        IEnumerable<Product> GetListBestRating(int size);
        IEnumerable<Product> GetListRelated(int productId, int categoryId, int size);
        IEnumerable<Product> GetListByCategory(int categoryId, int size);
        IEnumerable<Product> GetListTopProduct(int amount);
        Product GetById(int id);
        Product GetByIdInclude(int id);
        IEnumerable<Tag> GetListTagByProductId(int id);
        void IncreaseView(int id);
        IEnumerable<Product> GetListProductByTag(string tagId, string keyword, decimal minPrice, decimal maxPrice, int? categoryId, int ?brandId, int sortBy);
        void SaveChanges();
    }
    public class ProductService : IProductService
    {
        IProductRepository _productRepository;
        IProductTagRepository _productTagRepository;
        IProductCategoryRepository _productCategoryRepository;
        ITagRepository _tagRepository;
        IUnitOfWork _unitOfWork;
        public ProductService(IProductRepository productRepository, IProductTagRepository productTagRepository, IProductCategoryRepository productCategoryRepository, ITagRepository tagRepository, IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _productTagRepository = productTagRepository;
            _productCategoryRepository = productCategoryRepository;
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
                    if (_tagRepository.Count(t => t.Id == tagId) == 0)
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

        public IEnumerable<Product> GetAllProductDealsOfTheWeek()
        {
            return _productRepository.GetMulti(x => x.StatusDiscount == true && x.Quantity > 0).OrderByDescending(x => x.PromotionPrice);
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
                var listProductCategoryChild = _productCategoryRepository.GetMulti(x => x.ParentId == categoryId);
                return _productRepository.GetMulti(x => x.BrandId == brandId.Value && 
                                                        (x.CategoryId == categoryId.Value || listProductCategoryChild.FirstOrDefault(c => x.CategoryId == c.Id) != null));
            }
            else if(categoryId.HasValue && !brandId.HasValue)
            {
                var listProductCategoryChild = _productCategoryRepository.GetMulti(x => x.ParentId == categoryId);
                return _productRepository.GetMulti(x => x.CategoryId == categoryId.Value || listProductCategoryChild.FirstOrDefault(y => x.CategoryId == y.Id) != null);
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

        public IEnumerable<Product> GetAllProductBestSellingByCategoryId(int categoryId, int size)
        {
            var listProductCategoryChild = _productCategoryRepository.GetMulti(x => x.ParentId == categoryId);
            return _productRepository.GetMulti(x => x.Status && x.Quantity > 0 && (x.CategoryId == categoryId || listProductCategoryChild.FirstOrDefault(pc => pc.Id == x.CategoryId) != null))
                .OrderByDescending(x => x.QuantityHasSell).Take(size);
        }


        public IEnumerable<Product> GetListTopProduct(int amount)
        {
            return _productRepository.GetAll().OrderByDescending(x => x.QuantityHasSell).Take(amount);
        }

        public Product GetById(int id)
        {
            return _productRepository.GetSingleById(id);
        }

        public Product GetByIdInclude(int id)
        {
            return _productRepository.GetSingleByCondition(x => x.Id == id, new string[] { "ProductCategory", "Brand" });
        }


        public IEnumerable<Product> GetListProductByName(string name)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Product> GetListProductByTag(string tagId, string keyword, decimal minPrice, decimal maxPrice, int? categoryId, int? brandId, int sortBy)
        {

            var list = _productRepository.GetListProductByTag(tagId);

            if (categoryId.HasValue && brandId.HasValue)
            {
                var listProductCategoryChild = _productCategoryRepository.GetMulti(x => x.ParentId == categoryId);
                list = list.Where(x => x.BrandId == brandId.Value && (x.CategoryId == categoryId.Value || listProductCategoryChild.FirstOrDefault(c => x.CategoryId == c.Id) != null));
            }
            else if (categoryId.HasValue && !brandId.HasValue)
            {
                var listProductCategoryChild = _productCategoryRepository.GetMulti(x => x.ParentId == categoryId);
                list = list.Where(x => x.CategoryId == categoryId.Value || listProductCategoryChild.FirstOrDefault(y => x.CategoryId == y.Id) != null);
            }
            else if (brandId.HasValue && !categoryId.HasValue)
            {
                list = list.Where(x => x.BrandId == brandId.Value);
            }
            

            list = list.Where(x =>
            {
                if (x.PriceAfterDiscount.HasValue) return x.PriceAfterDiscount >= minPrice && x.PriceAfterDiscount <= maxPrice;
                return x.Price >= minPrice && x.Price <= maxPrice;
            });

            if (!string.IsNullOrEmpty(keyword))
            {
                list = list.Where(x => x.Name.Contains(keyword));
            }

            switch (sortBy)
            {
                case 0: return list;
                case 1: return list.OrderBy(x => x.Name);
                case 2: return list.OrderByDescending(x => x.Name);
                case 3: return list.OrderBy(x => x.Price);
                case 4: return list.OrderByDescending(x => x.Price);

            }
            return list;
        }

        public IEnumerable<Tag> GetListTagByProductId(int id)
        {
            return _productTagRepository.
                GetMulti(x => x.ProductId == id, new string[] { "Tag" })
                .Select(y => y.Tag);
        }


        public void IncreaseView(int id)
        {
            var product = _productRepository.GetSingleById(id);
            if (product.ViewCount.HasValue)
            {
                product.ViewCount++;
            }
            else
            {
                product.ViewCount = 1;
            }
               
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
                    var tagId  = StringHelper.ToUnsignString(tags[i]);
                    if(_tagRepository.Count(x => x.Id == tagId) == 0)
                    {
                        Tag tag = new Tag()
                        {
                            Id = tagId,
                            Name = tags[i],
                            Type = CommonConstants.ProductTag
                        };

                        _tagRepository.Add(tag);
                    }
                    _productTagRepository.DeleteMulti(x => x.ProductId == product.Id);
                    ProductTag productTag = new ProductTag()
                    {
                        ProductId = product.Id,
                        TagId = tagId,
                    };

                    _productTagRepository.Add(productTag);
                    
                }
                _unitOfWork.Commit();

            }

        }

        public IEnumerable<Product> GetListBestSeller(int size)
        {
            return _productRepository.GetMulti(x => x.Status).OrderByDescending(x => x.QuantityHasSell).Take(size);
        }

        public IEnumerable<Product> GetListNew(int size)
        {
            return _productRepository.GetMulti(x => x.Status).OrderByDescending(x => x.CreatedDate).Take(size);
        }

        public IEnumerable<Product> GetListBestRating(int size)
        {
            return _productRepository.GetMulti(x => x.Status).OrderByDescending(x => x.Quantity).Take(size);
        }

        public IEnumerable<Product> GetListRelated(int productId, int categoryId, int size)
        {
            var listProductCategoryChild = _productCategoryRepository.GetMulti(x => x.ParentId == categoryId);
            return _productRepository.GetMulti(x => x.Status && x.Id != productId && ( x.CategoryId == categoryId || listProductCategoryChild.FirstOrDefault(y => y.Id == x.CategoryId) != null))
                .OrderByDescending(x => x.Quantity).Take(size);
        }

        public IEnumerable<Product> GetListByCategory(int categoryId, int size)
        {
            var listProductCategoryChild = _productCategoryRepository.GetMulti(x => x.ParentId == categoryId);
            var listProductByCategory = _productRepository.GetMulti(x => x.CategoryId == categoryId || listProductCategoryChild.FirstOrDefault(y => y.Id == x.CategoryId) != null ).Take(size);
            return listProductByCategory;
        }

        public IEnumerable<Product> GetAll(string keyword, decimal minPrice, decimal maxPrice, int? categoryId, int? brandId, int sortBy)
        {

            var list = GetAll(categoryId, brandId).Where(x =>
            {
                if (x.PriceAfterDiscount.HasValue) return x.PriceAfterDiscount >= minPrice && x.PriceAfterDiscount <= maxPrice;
                return x.Price >= minPrice && x.Price <= maxPrice;
            });

            if (!string.IsNullOrEmpty(keyword))
            {
                list =  list.Where(x => x.Name.Contains(keyword));
            }

            switch (sortBy)
            {
                case 0:
                    break;
                case 1: list = list.OrderBy(x => x.Name);
                    break;
                case 2: list = list.OrderByDescending(x => x.Name);
                    break;
                case 3: list = list.OrderBy(x => x.Price);
                    break;
                case 4: list = list.OrderByDescending(x => x.Price);
                    break;
            
            }   

            return list;
        }

        public Tag GetTagById(string tagId)
        {
            throw new NotImplementedException();
        }
    }
}
