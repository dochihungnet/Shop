namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_Product_3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Products", "PriceAfterDiscount", c => c.Decimal(precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Products", "PriceAfterDiscount");
        }
    }
}
