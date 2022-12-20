namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_database_End_ : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "TransportFee", c => c.Decimal(precision: 18, scale: 2));
            AlterColumn("dbo.Orders", "CustomerMessage", c => c.String());
            AlterColumn("dbo.Orders", "PaymentMethod", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "PaymentMethod", c => c.String(maxLength: 256));
            AlterColumn("dbo.Orders", "CustomerMessage", c => c.String(nullable: false, maxLength: 256));
            DropColumn("dbo.Orders", "TransportFee");
        }
    }
}
