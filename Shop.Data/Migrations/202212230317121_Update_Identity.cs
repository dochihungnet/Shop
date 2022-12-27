namespace Shop.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Update_Identity : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.AspNetUserClaims", newName: "ApplicationUserClaims");
            RenameTable(name: "dbo.AspNetUserLogins", newName: "ApplicationUserLogins");
            RenameTable(name: "dbo.AspNetRoles", newName: "ApplicationRoles");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.ApplicationRoles", newName: "AspNetRoles");
            RenameTable(name: "dbo.ApplicationUserLogins", newName: "AspNetUserLogins");
            RenameTable(name: "dbo.ApplicationUserClaims", newName: "AspNetUserClaims");
        }
    }
}
