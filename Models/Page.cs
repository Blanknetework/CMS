using System;
using System.ComponentModel.DataAnnotations;

namespace ModernCMS.Models
{
    public class Page
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Slug { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public bool IsPublished { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? MetaDescription { get; set; }

        public string? MetaKeywords { get; set; }
    }
} 