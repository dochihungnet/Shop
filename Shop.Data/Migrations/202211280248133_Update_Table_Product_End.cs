namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_Product_End : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Products", "EndDiscountDate", c => c.DateTime());
            DropColumn("dbo.Products", "EndDiscountcDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Products", "EndDiscountcDate", c => c.DateTime());
            DropColumn("dbo.Products", "EndDiscountDate");
        }
    }
}
