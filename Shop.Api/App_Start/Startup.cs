using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Microsoft.Owin;
using Owin;
using Shop.Data;
using Shop.Data.Infrastructure;
using Shop.Data.Repositories;
using Shop.Service;
using System;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;

[assembly: OwinStartup(typeof(Shop.Api.App_Start.Startup))]

namespace Shop.Api.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigAutofac(app);
        }

        private void ConfigAutofac(IAppBuilder app)
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // Mỗi khi có class nào có request(lời yêu cầu) đến IUnitOfWork thì nó
            // sẽ instance 1 cái đối tượng UnitOfWork
            // Ngắn gọn, mỗi khi có request cần khởi tạo 1 đối tượng mà để khởi tạo đối tượng đó cần 
            // khởi tạo đối tượng UnitOfWork or Db ... thì Autofac sẽ auto khởi tạo cho mình
            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>().InstancePerRequest();
            builder.RegisterType<DbFactory>().As<IDbFactory>().InstancePerRequest();

            // InstancePerRequest: có nhiệm vụ: mỗi một session nó sẽ tạo một đối tượng này

            builder.RegisterType<ShopDbContext>().AsSelf().InstancePerRequest();

            //ImplementedInterfaces() : As các giao diện được triển khai
            // Reposiories
            builder.RegisterAssemblyTypes(typeof(PostCategoryRepository).Assembly)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces().InstancePerRequest();

            // Services
            builder.RegisterAssemblyTypes(typeof(PostCategoryService).Assembly)
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces().InstancePerRequest();

            // Resolver: người giải quyết
            // Dependency Resolver: người giải quyết phụ thuộc
            Autofac.IContainer container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}
