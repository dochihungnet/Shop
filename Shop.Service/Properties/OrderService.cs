using Shop.Data.Infrastructure;
using Shop.Data.Repositories;
using Shop.Model.Models;

namespace Shop.Service.Properties
{
    public interface IOrderService
    {
        bool Create(Order order);
    }
    public class OrderService : IOrderService
    {
        private IOrderRepository _orderRepository;
        private IOrderDetailRepository _orderDetailRepository;
        private IUnitOfWork _unitOfWork;

        public OrderService(IOrderRepository orderRepository, IOrderDetailRepository orderDetailRepository,
            IUnitOfWork unitOfWork)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _unitOfWork = unitOfWork;
        }
        
        public bool Create(Order order)
        {
            try
            {
                var orderResult = _orderRepository.Add(order);
                _unitOfWork.Commit();

                foreach (var orderDetail in order.OrderDetails)
                {
                    orderDetail.OrderId = orderResult.Id;
                    _orderDetailRepository.Add(orderDetail);
                }

                _unitOfWork.Commit();
                return true;
            }
            catch
            {
                throw;
            }
        }
    }
}