using System;
using System.Collections.Generic;
using System.Linq;
using Shop.Data.Infrastructure;
using Shop.Data.Repositories;
using Shop.Model.Models;

namespace Shop.Service
{
    public interface IShoppingCartService
    {
        // add product
        bool AddProductShoppingCart(ShoppingCart shoppingCart);
        // delete product
        bool DeleteProductShoppingCart(string customerId, int productId);
        // update product
        bool UpdateQuantityProductShoppingCart(ShoppingCart shoppingCart);
        // update cart
        bool UpdateShoppingCart(string customerId, List<ShoppingCart> shoppingCarts);
        // delete cart
        bool DeleteShoppingCart(string customerId);
        // get all product shopping cart
        IEnumerable<ShoppingCart> GetAllProductShoppingCartByCustomerId(string customerId);
        // get single product shopping cart by customerId and productId
        ShoppingCart GetSingleProductShoppingCart(string customerId, int productId);
        
        // save change
        void SaveChanges();
    }

    public class ShoppingCartService : IShoppingCartService
    {
        private IShoppingCartRepository _shoppingCartRepositoryRepository;
        private IUnitOfWork _unitOfWork;

        public ShoppingCartService(IShoppingCartRepository shoppingCartRepositoryRepository, IUnitOfWork unitOfWork)
        {
            _shoppingCartRepositoryRepository = shoppingCartRepositoryRepository;
            _unitOfWork = unitOfWork;
        }
        
        public bool AddProductShoppingCart(ShoppingCart shoppingCart)
        {
            try
            {
                _shoppingCartRepositoryRepository.Add(shoppingCart);
                _unitOfWork.Commit();
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public bool DeleteProductShoppingCart(string customerId, int productId)
        {
            try
            {
                _shoppingCartRepositoryRepository.DeleteMulti(spc => spc.CustomerId == customerId && spc.ProductId == productId);
                _unitOfWork.Commit();
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
            
        }

        public bool UpdateQuantityProductShoppingCart(ShoppingCart shoppingCart)
        {
            try
            {
                _shoppingCartRepositoryRepository.Update(shoppingCart);
                _unitOfWork.Commit();
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public bool UpdateShoppingCart(string customerId, List<ShoppingCart> shoppingCarts)
        {
            try
            {
                foreach (var shoppingCart in shoppingCarts)
                {
                    _shoppingCartRepositoryRepository.Update(shoppingCart);
                }
                _unitOfWork.Commit();
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public bool DeleteShoppingCart(string customerId)
        {
            try
            {
                _shoppingCartRepositoryRepository.DeleteMulti(spc => spc.CustomerId == customerId);
                _unitOfWork.Commit();
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public IEnumerable<ShoppingCart> GetAllProductShoppingCartByCustomerId(string customerId)
        {
            return _shoppingCartRepositoryRepository.GetMulti(spc => spc.CustomerId == customerId).OrderByDescending(x => x.CreatedDate);
        }
        

        public ShoppingCart GetSingleProductShoppingCart(string customerId, int productId)
        {
            return _shoppingCartRepositoryRepository.GetSingleByCondition(spc =>
                spc.CustomerId == customerId && spc.ProductId == productId);
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }
    }


}