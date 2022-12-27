namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Nekkk : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "PaymentMethod", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "PaymentMethod", c => c.String());
        }
    }
}
