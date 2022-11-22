namespace Shop.Data.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
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
            CreateUser(context);
            CreateProductCategorySimple(context);
            CreateBrandSimple(context);

        }

        private void CreateUser(ShopDbContext context)
        {
            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ShopDbContext()));

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ShopDbContext()));

            var user = new ApplicationUser()
            {
                UserName = "dochihung",
                Email = "dochihung492002@gmail.com",
                EmailConfirmed = true,
                BirthDay = DateTime.Now,
                FullName = "Đỗ Chí Hùng"

            };
            if (manager.Users.Count(x => x.UserName == "dochihung") == 0)
            {
                manager.Create(user, "hungiy1");

                if (!roleManager.Roles.Any())
                {
                    roleManager.Create(new IdentityRole { Name = "Admin" });
                    roleManager.Create(new IdentityRole { Name = "User" });
                }

                var adminUser = manager.FindByEmail("dochihung492002@gmail.com");

                manager.AddToRoles(adminUser.Id, new string[] { "Admin", "User" });
            }

        }
        private void CreateBrandSimple(Shop.Data.ShopDbContext context)
        {
            if (context.Brands.Count() == 0)
            {
                List<Brand> listBrand = new List<Brand>()
                {
                    new Brand(){ Name = "Apple", Alias = "apple", HomeFlag = true, CreatedDate = DateTime.Now, CreatedBy = "admin", Status = true },
                    new Brand(){ Name = "FPT", Alias = "fpt",  HomeFlag = true, CreatedDate = DateTime.Now, CreatedBy = "admin", Status = true },
                    new Brand(){ Name = "Yody", Alias = "yody", HomeFlag = true, CreatedDate = DateTime.Now, CreatedBy = "admin",  Status = true },
                    new Brand(){ Name = "Teko VietNam", Alias = "teko-vietnam", HomeFlag = true, CreatedDate = DateTime.Now, CreatedBy = "admin", Status = true },
                    new Brand(){ Name = "NashTech", Alias = "nashtech",  HomeFlag = true, CreatedDate = DateTime.Now, CreatedBy = "admin", Status = true },
                    new Brand(){ Name = "VNG Game", Alias = "vng-game",  HomeFlag = true, CreatedDate = DateTime.Now, CreatedBy = "admin", Status = true },
                    new Brand(){ Name = "Computer", Alias = "computer", HomeFlag = true, CreatedDate = DateTime.Now, CreatedBy = "admin", Status = true }
                };
                context.Brands.AddRange(listBrand);
            }
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
