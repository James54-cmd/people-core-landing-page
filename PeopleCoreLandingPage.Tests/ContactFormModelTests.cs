using System.ComponentModel.DataAnnotations;
using PeopleCoreLandingPage.Models;

namespace PeopleCoreLandingPage.Tests;

public class ContactFormModelTests
{
    private static List<ValidationResult> Validate(ContactFormModel model)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(model, new ValidationContext(model), results, validateAllProperties: true);
        return results;
    }

    private static ContactFormModel ValidModel() => new()
    {
        FirstName = "Jane",
        LastName = "Doe",
        ContactNumber = "09171234567",
        EmailAddress = "jane@example.com",
        Inquiries = "I would like to request a demo of the platform, please."
    };

    [Fact]
    public void Fully_populated_model_is_valid()
    {
        Assert.Empty(Validate(ValidModel()));
    }

    [Fact]
    public void Empty_model_fails_all_required_fields()
    {
        var results = Validate(new ContactFormModel());

        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ContactFormModel.FirstName)));
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ContactFormModel.LastName)));
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ContactFormModel.ContactNumber)));
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ContactFormModel.EmailAddress)));
        Assert.Contains(results, r => r.MemberNames.Contains(nameof(ContactFormModel.Inquiries)));
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("no-at-sign.com")]
    [InlineData("@nope.com")]
    public void Invalid_email_is_rejected(string email)
    {
        var model = ValidModel();
        model.EmailAddress = email;

        Assert.Contains(Validate(model), r => r.MemberNames.Contains(nameof(ContactFormModel.EmailAddress)));
    }

    [Fact]
    public void Inquiry_shorter_than_minimum_is_rejected()
    {
        var model = ValidModel();
        model.Inquiries = "too short"; // 9 chars, below the 10-char minimum

        Assert.Contains(Validate(model), r => r.MemberNames.Contains(nameof(ContactFormModel.Inquiries)));
    }

    [Fact]
    public void Inquiry_within_length_bounds_is_accepted()
    {
        var model = ValidModel();
        model.Inquiries = new string('a', 4000); // exactly the maximum

        Assert.DoesNotContain(Validate(model), r => r.MemberNames.Contains(nameof(ContactFormModel.Inquiries)));
    }
}
