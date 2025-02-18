using Microsoft.EntityFrameworkCore.Migrations;

public partial class AddAdminUser : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            INSERT INTO AspNetUsers (UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
            VALUES ('admin@moderncms.com', 'ADMIN@MODERNCMS.COM', 'admin@moderncms.com', 'ADMIN@MODERNCMS.COM', 1, 'AQAAAAEAACcQAAAAEHxwPMKz9LqkL1NPYuY8bWoOwMWZvpKT5YWsZ1pWHNr0N6Wd7Cz9VyXRQA3WLtQQXw==', 'VVPCRDJS3MJWQD5CSW2GWPRADBXEZINC', NEWID(), 0, 0, 0, 0)
        ");

        migrationBuilder.Sql(@"
            INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
            VALUES (NEWID(), 'Administrator', 'ADMINISTRATOR', NEWID())
        ");

        migrationBuilder.Sql(@"
            INSERT INTO AspNetUserRoles (UserId, RoleId)
            SELECT u.Id, r.Id
            FROM AspNetUsers u, AspNetRoles r
            WHERE u.Email = 'admin@moderncms.com' AND r.Name = 'Administrator'
        ");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Remove the admin user and role if needed
    }
} 