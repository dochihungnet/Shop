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
    public interface IBrandService
    {
        Brand Add(Brand brand);
        void Update(Brand brand);
        Brand Delete(Brand brand);
        Brand Delete(int id);
        IEnumerable<Brand> GetAll();
        IEnumerable<Brand> GetAll(string keyword);
        Brand GetById(int id);
        void SaveChanges();
    }
    public class BrandService : IBrandService
    {
        private IBrandRepository _brandRepository;
        private IUnitOfWork _unitOfWork;
        public BrandService(IBrandRepository brandRepository, IUnitOfWork unitOfWork)
        {
            this._brandRepository = brandRepository;
            this._unitOfWork = unitOfWork;
        }
        public Brand Add(Brand brand)
        {
            return _brandRepository.Add(brand);
        }

        public Brand Delete(Brand brand)
        {
            return _brandRepository.Delete(brand);
        }

        public Brand Delete(int id)
        {
            return _brandRepository.Delete(id);
        }

        public IEnumerable<Brand> GetAll()
        {
            return _brandRepository.GetAll();
        }

        public IEnumerable<Brand> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return _brandRepository.GetMulti(x => x.Name.Contains(keyword) || x.Description.Contains(keyword));
            }
            return _brandRepository.GetAll();
        }

        public Brand GetById(int id)
        {
            return _brandRepository.GetSingleById(id);
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public void Update(Brand brand)
        {
            _brandRepository.Update(brand);
        }
    }
}
