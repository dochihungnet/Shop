﻿using Shop.Model.Abstract;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Model.Models
{
    [Table("ProductCategories")]
    public class ProductCategory : Auditable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }

        [Required]
        [Column(TypeName = "varchar")]
        [MaxLength(256)]
        public string Alias { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public int? DisplayOrder { get; set; }

        [MaxLength(256)]
        public string Image { set; get; }
        public bool? HomeFlag { get; set; }

        public virtual IEnumerable<Post> Posts { set; get; } // bưu kiện
        public virtual IEnumerable<Product> Products { get; set; }
    }
}
