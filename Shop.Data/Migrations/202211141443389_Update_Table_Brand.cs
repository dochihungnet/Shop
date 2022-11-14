namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Table_Brand : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Brands", "ParentId");
            DropColumn("dbo.Brands", "DisplayOrder");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Brands", "DisplayOrder", c => c.Int());
            AddColumn("dbo.Brands", "ParentId", c => c.Int());
        }
    }
}
