namespace Shop.Data.Migrations
{
    using Shop.Model.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Shop.Data.ShopDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Shop.Data.ShopDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.
            CreateProductCategorySimple(context);



        }

        private void CreateProductCategorySimple(Shop.Data.ShopDbContext context)
        {
            if (context.ProductCategories.Count() == 0)
            {
                List<ProductCategory> listProductCategory = new List<ProductCategory>()
                {
                    new ProductCategory(){ Name = "Máy tính", Alias = "may-tinh", Status = true },
                    new ProductCategory(){ Name = "Điện thoại", Alias = "dien-thoai", Status = true },
                    new ProductCategory(){ Name = "Quần áo", Alias = "quan-ao", Status = true },
                    new ProductCategory(){ Name = "Mỹ phẩm", Alias = "my-pham", Status = true },
                    new ProductCategory(){ Name = "Đồ gia dụng", Alias = "do-gia-dung", Status = true },
                    new ProductCategory(){ Name = "Trang sức", Alias = "trang-suc", Status = true },
                };
                context.ProductCategories.AddRange(listProductCategory);
            }
        }
    }
}
