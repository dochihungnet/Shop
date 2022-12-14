namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_Order : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "CustomerDeliveryAddress", c => c.String(nullable: false, maxLength: 256));
            AddColumn("dbo.AspNetUsers", "DeliveryAddressDefault", c => c.Int());
            DropColumn("dbo.Orders", "CustomerAddress");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Orders", "CustomerAddress", c => c.String(nullable: false, maxLength: 256));
            DropColumn("dbo.AspNetUsers", "DeliveryAddressDefault");
            DropColumn("dbo.Orders", "CustomerDeliveryAddress");
        }
    }
}
