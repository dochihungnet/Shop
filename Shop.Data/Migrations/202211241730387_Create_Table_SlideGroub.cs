namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Create_Table_SlideGroub : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SlideGroups",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.ID);
            
            AddColumn("dbo.Slides", "GroupID", c => c.Int(nullable: false));
            CreateIndex("dbo.Slides", "GroupID");
            AddForeignKey("dbo.Slides", "GroupID", "dbo.SlideGroups", "ID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Slides", "GroupID", "dbo.SlideGroups");
            DropIndex("dbo.Slides", new[] { "GroupID" });
            DropColumn("dbo.Slides", "GroupID");
            DropTable("dbo.SlideGroups");
        }
    }
}
