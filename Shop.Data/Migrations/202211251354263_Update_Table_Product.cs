namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_Product : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Products", "QuantityHasSell", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Products", "QuantityHasSell");
        }
    }
}
