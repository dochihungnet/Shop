using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Data.Infrastructure;
using Shop.Data.Repositories;
using Shop.Model.Models;

namespace Shop.Service
{
    public interface IOrderService
    {
        bool AddOrder(Order order);
        void UpdateOrder(Order order);
        Order DeleteOrder(Order order);
        Order DeleteOrder(int orderId);
        IEnumerable<Order> GetAllOrder();
        IEnumerable<Order> GetAllOrderByCustomerId(string customerId);
        IEnumerable<Order> GetAllOrderByDay(DateTime day);
        IEnumerable<Order> GetAllOrderByPaymentStatus(bool status);
        void SaveChanges();
    }
    public class OrderService : IOrderService
    {
        private IOrderRepository _orderRepository;
        private IOrderDetailRepository _orderDetailRepository;
        private IProductRepository _productRepository;
        IUnitOfWork _unitOfWork;
        public OrderService(IOrderRepository orderRepository , IOrderDetailRepository orderDetailRepository, IProductRepository productRepository,IUnitOfWork unitOfWork)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
        }
        public bool AddOrder(Order order)
        {
            var orderNew = _orderRepository.Add(order);
            SaveChanges();
            foreach (var orderDetail in orderNew.OrderDetails)
            {
                orderDetail.OrderId = orderNew.Id;
                _orderDetailRepository.Add(orderDetail);
                var product = _productRepository.GetSingleById(orderDetail.ProductId);
                if (orderDetail.Quantity > product.Quantity)
                {
                    return false;
                }
                else
                {
                    product.Quantity = product.Quantity - orderDetail.Quantity;
                    product.QuantityHasSell = product.QuantityHasSell + orderDetail.Quantity;
                }

            }
            SaveChanges();
            
            return true;
        }

        public void UpdateOrder(Order order)
        {
            _orderRepository.Update(order);
        }

        public Order DeleteOrder(Order order)
        {
            return _orderRepository.Delete(order);
        }

        public Order DeleteOrder(int orderId)
        {
            return _orderRepository.Delete(orderId);
        }

        public IEnumerable<Order> GetAllOrder()
        {
            return _orderRepository.GetAll();
        }

        public IEnumerable<Order> GetAllOrderByCustomerId(string customerId)
        {
            return _orderRepository.GetMulti(x => x.CustomerId == customerId, new string[]{"OrderDetails"});
        }

        public IEnumerable<Order> GetAllOrderByDay(DateTime day)
        {

            return _orderRepository.GetMulti(x => x.CreatedDate.Value.Year == day.Year 
                                                  && x.CreatedDate.Value.Month == day.Month
                                                  && x.CreatedDate.Value.Day == day.Day
                                                  );
        }

        public IEnumerable<Order> GetAllOrderByPaymentStatus(bool status)
        {
            return _orderRepository.GetMulti(x => x.Status == status);
        }


        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }
    }
}
