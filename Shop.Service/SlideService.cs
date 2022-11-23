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
    public interface ISlideService
    {
        Slide Add(Slide slide);
        void Update(Slide slide);
        Slide Delete(Slide slide);
        Slide Delete(int id);
        Slide GetById(int id);
        IEnumerable<Slide> GetAll();
        IEnumerable<Slide> GetAll(bool? status);
        void SaveChanges();
    }
    public class SlideService : ISlideService
    {
        private ISlideRepository _slideRepository;
        private IUnitOfWork _unitOfWork;

        public SlideService(ISlideRepository slideRepository, IUnitOfWork unitOfWork)
        {
            this._slideRepository = slideRepository;
            this._unitOfWork = unitOfWork;
        }

        public Slide Add(Slide slide)
        {
            return _slideRepository.Add(slide);
        }

        public Slide Delete(Slide slide)
        {
            return _slideRepository.Delete(slide);
        }

        public Slide Delete(int id)
        {
            return _slideRepository.Delete(id);
        }

        public IEnumerable<Slide> GetAll()
        {
            return _slideRepository.GetAll();
        }

        public IEnumerable<Slide> GetAll(bool? status)
        {
            return _slideRepository.GetAll().Where(s => s.Status == status);
        }

        public Slide GetById(int id)
        {
            return _slideRepository.GetSingleById(id);
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public void Update(Slide slide)
        {
            _slideRepository.Update(slide);
        }
    }
}
