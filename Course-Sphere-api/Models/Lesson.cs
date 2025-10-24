using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Course_Sphere_api.Models
{
    public class Lesson
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime PublishDate { get; set; }
        public string Video_URL { get; set; } = string.Empty;
        public Guid CourseId { get; set; }
        public Guid CreatorId { get; set; }
    }
}