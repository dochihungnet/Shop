using System.Collections.Generic;

namespace Shop.Api.Models
{
    public class SlideGroupViewModel
    {
        public int ID { set; get; }
        public string Name { set; get; }
        public virtual IEnumerable<SlideViewModel> SlideViewModels { set; get; }
    }
}