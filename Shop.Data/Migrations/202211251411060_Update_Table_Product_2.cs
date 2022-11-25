namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_Product_2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Products", "EndDiscountcDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Products", "EndDiscountcDate");
        }
    }
}
