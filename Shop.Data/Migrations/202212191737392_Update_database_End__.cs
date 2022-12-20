namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_database_End__ : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "Vat", c => c.Single());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Orders", "Vat");
        }
    }
}
