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
    public interface ISlideGroupService
    {
        SlideGroup Add(SlideGroup slideGroup);
        void Update(SlideGroup slideGroup);
        SlideGroup Delete(SlideGroup slideGroup);
        SlideGroup Delete(int id);
        IEnumerable<SlideGroup> GetAll();
        SlideGroup GetByName(string groupName);
        SlideGroup GetById(int id);
        void SaveChanges();
    }
    public class SlideGroupService : ISlideGroupService
    {
        ISlideGroupRepository _slideGroupRepository;
        IUnitOfWork _unitOfWork;

        public SlideGroupService(ISlideGroupRepository slideGroupRepository, IUnitOfWork unitOfWork)
        {
            _slideGroupRepository = slideGroupRepository;
            _unitOfWork = unitOfWork;
        }

        public SlideGroup Add(SlideGroup slideGroup)
        {
            return _slideGroupRepository.Add(slideGroup);
        }

        public SlideGroup Delete(SlideGroup slideGroup)
        {
            return _slideGroupRepository.Delete(slideGroup);
        }

        public SlideGroup Delete(int id)
        {
            return _slideGroupRepository.Delete(id);
        }

        public IEnumerable<SlideGroup> GetAll()
        {
            return _slideGroupRepository.GetAll();
        }

        public SlideGroup GetById(int id)
        {
            return _slideGroupRepository.GetSingleById(id);
        }

        public SlideGroup GetByName(string groupName)
        {
            return _slideGroupRepository.GetSingleByCondition(x => String.Compare(x.Name, groupName, true) == 0);
        }

        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public void Update(SlideGroup slideGroup)
        {
            _slideGroupRepository.Update(slideGroup);
        }
    }
}
