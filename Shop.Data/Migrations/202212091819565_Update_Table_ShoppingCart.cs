namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_ShoppingCart : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ShoppingCarts", "Name", c => c.String());
            AddColumn("dbo.ShoppingCarts", "Image", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ShoppingCarts", "Image");
            DropColumn("dbo.ShoppingCarts", "Name");
        }
    }
}
