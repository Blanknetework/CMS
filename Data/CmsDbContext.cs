using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ModernCMS.Models;

namespace ModernCMS.Data
{
    public class CmsDbContext : IdentityDbContext
    {
        public CmsDbContext(DbContextOptions<CmsDbContext> options)
            : base(options)
        {
        }

        public DbSet<Page> Pages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Page>()
                .HasIndex(p => p.Slug)
                .IsUnique();
        }
    }
} 