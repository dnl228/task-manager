using FluentValidation;
using TaskApi.Models;

namespace TaskApi.Validators
{
    public class TaskItemValidator : AbstractValidator<TaskItem>
    {
        public TaskItemValidator()
        {
            RuleFor(x => x.Title).NotEmpty().MaximumLength(120);
            RuleFor(x => x.Description).MaximumLength(1000);
        }
    }
}
