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
    public interface ITagService
    {
        Tag GetTagById(string tagId);
    }

    public class TagService : ITagService
    {
        ITagRepository _tagRepository;
        IUnitOfWork _unitOfWork;
        public TagService(ITagRepository tagRepository, IUnitOfWork unitOfWork)
        {
            _tagRepository = tagRepository;
            _unitOfWork = unitOfWork;
        }
        public Tag GetTagById(string tagId)
        {
            return _tagRepository.GetSingleByCondition(x => x.Id == tagId);
        }
    }


}

