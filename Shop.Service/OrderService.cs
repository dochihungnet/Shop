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
        Order AddOrder(Order order);
        Order UpdateOrder(Order order);
        Order DeleteOrder(Order order);
        Order DeleteOrder(int orderId);
        Order GetOrderById(int orderId);
        IEnumerable<Order> GetAllOrder();
        // conditional: có điều kiện
        IEnumerable<Order> GetAllOrderConditional(string keyword, int? orderId, string customerName, string email, bool? paymentStatus, int? orderStatus, DateTime? createdDate);
        IEnumerable<Order> GetAllOrderByCustomerId(string customerId);
        IEnumerable<Order> GetAllOrderByDay(DateTime day);
        IEnumerable<Order> GetAllOrderByPaymentStatus(bool status);
        bool UpdatePaymentStatus(int orderId, bool status);
        Order GetOrderByEmailOrderId(string email, int orderId);
        IEnumerable<Order> GetAllOrder(int orderStatus);
        IEnumerable<Order> GetRecentOrders(int amount);
        decimal GetTotalRevenue();
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
        public Order AddOrder(Order order)
        {
            var orderNew = _orderRepository.Add(order);
            SaveChanges();
            foreach (var orderDetail in order.OrderDetails)
            {
                var product = _productRepository.GetSingleById(orderDetail.ProductId);
                if (!product.QuantityHasSell.HasValue) product.QuantityHasSell = 0;
                if (orderDetail.Quantity > product.Quantity)
                {
                    _orderRepository.Delete(orderNew.Id);
                    return null;
                }
                else
                {
                    product.Quantity = product.Quantity - orderDetail.Quantity;
                    product.QuantityHasSell = product.QuantityHasSell + orderDetail.Quantity;
                }
            }
            SaveChanges();
            return orderNew;
        }

        public Order UpdateOrder(Order order)
        {
            var _order =_orderRepository.GetOrderById(order.Id);
            _order.OrderStatus = order.OrderStatus;
            SaveChanges();
            return _order;

        }

        public Order DeleteOrder(Order order)
        {
            return _orderRepository.Delete(order);
        }

        public Order DeleteOrder(int orderId)
        {
            return _orderRepository.Delete(orderId);
        }

        public Order GetOrderById(int orderId)
        {
            return _orderRepository.GetOrderById(orderId);
        }

        public IEnumerable<Order> GetAllOrder()
        {
            return _orderRepository.GetAll().OrderByDescending(x => x.CreatedDate);
        }

        public IEnumerable<Order> GetRecentOrders(int amount)
        {
            return _orderRepository.GetAll().OrderByDescending(x => x.CreatedDate).Take(amount);
        }

        public decimal GetTotalRevenue()
        {
            var orders = _orderRepository.GetAll(new string[]{"OrderDetails"}).ToList();
            decimal totalRevenue = 0;
            foreach (var order in orders)
            {
                foreach (var orderdetail in order.OrderDetails)
                {
                    totalRevenue += orderdetail.Quantity * orderdetail.Price;
                }
            }

            return totalRevenue;
        }

        // Conditional: có điều kiện
        public IEnumerable<Order> GetAllOrderConditional(string keyword, int? orderId,
            string customerName, string email, bool? paymentStatus, 
            int? orderStatus, DateTime? createdDate)
        {
            IEnumerable<Order> orders = _orderRepository.GetAll(new string[]{"OrderDetails"}).OrderByDescending(x => x.CreatedDate);
            
            if (!String.IsNullOrEmpty(keyword)) 
                orders = orders.Where(x => x.CustomerName.Contains(keyword));
            
            if (orderId.HasValue) 
                orders = orders.Where(x => x.Id == orderId);
           
            if(!String.IsNullOrEmpty(customerName)) 
                orders = orders.Where(x => x.CustomerName.Contains(customerName));

            if (!String.IsNullOrEmpty(email))
                orders = orders.Where(x => x.CustomerEmail.Contains(email));
            
            if (paymentStatus.HasValue)
                orders = orders.Where(x => x.PaymentStatus == paymentStatus);
            
            if (orderStatus.HasValue) 
                orders = orders.Where(x => x.OrderStatus == orderStatus);
            
            if (createdDate.HasValue)
                orders = orders.Where(x => x.CreatedDate.Value.Year == createdDate.Value.Year &&
                                           x.CreatedDate.Value.Month == createdDate.Value.Month &&
                                           x.CreatedDate.Value.Day == createdDate.Value.Day);
            return orders;
        }

        public IEnumerable<Order> GetAllOrderByCustomerId(string customerId)
        {
            return _orderRepository.GetMulti(x => x.CustomerId == customerId, new string[]{"OrderDetails"}).OrderByDescending(y => y.CreatedDate);
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

        public bool UpdatePaymentStatus(int orderId, bool status)
        {
            var order = _orderRepository.GetSingleById(orderId);
            order.PaymentStatus = status;
            _orderRepository.Update(order);
            return true;
        }

        public Order GetOrderByEmailOrderId(string email, int orderId)
        {
            return _orderRepository.GetSingleByCondition(o => o.CustomerEmail == email && o.Id == orderId);
        }

        public IEnumerable<Order> GetAllOrder(int orderStatus)
        {
            return _orderRepository.GetMulti(x => x.OrderStatus == orderStatus, new string[] { "OrderDetails" });
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }
    }
}
