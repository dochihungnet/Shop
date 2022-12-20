using System;
using System.Collections.Generic;
using Shop.Data.Infrastructure;
using Shop.Data.Repositories;
using Shop.Model.Models;

namespace Shop.Service
{
    public interface IDeliveryAddressService
    {
        DeliveryAddress Add(DeliveryAddress deliveryAddress);
        bool Update(DeliveryAddress deliveryAddress);
        IEnumerable<DeliveryAddress> GetAll();
        IEnumerable<DeliveryAddress> GetAllByUserId(string userId);
       DeliveryAddress GetById(int id);

        void SaveChanges();
    }
    
    public class DeliveryAddressService : IDeliveryAddressService
    {
        IDeliveryAddressRepository _deliveryAddressRepository;
        IUnitOfWork _unitOfWork;
        public DeliveryAddressService(IDeliveryAddressRepository deliveryAddressRepository, IUnitOfWork unitOfWork)
        {
            _deliveryAddressRepository = deliveryAddressRepository;
            _unitOfWork = unitOfWork;
        }
        
        public DeliveryAddress Add(DeliveryAddress deliveryAddress)
        {
            return _deliveryAddressRepository.Add(deliveryAddress);
        }

        public bool Update(DeliveryAddress deliveryAddress)
        {
            try
            {
                _deliveryAddressRepository.Update(deliveryAddress);
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        public IEnumerable<DeliveryAddress> GetAll()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<DeliveryAddress> GetAllByUserId(string userId)
        {
            return _deliveryAddressRepository.GetMulti(x => x.CustomerId == userId);
        }

        public DeliveryAddress GetById(int id)
        {
            return _deliveryAddressRepository.GetSingleById(id);
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }
    }
}