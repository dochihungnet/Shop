namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_Product_4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Products", "StatusDiscount", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Products", "StatusDiscount");
        }
    }
}
