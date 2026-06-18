using System.ComponentModel.DataAnnotations;

namespace PeopleCoreLandingPage.Models;

/// <summary>
/// Shared model for the contact form, used by both the standalone Contact page
/// (<c>Components/Pages/Contact.razor</c>) and the slide-in Contact dialog
/// (<c>Components/Shared/ContactDialog.razor</c>) via <c>Components/Shared/ContactForm.razor</c>.
/// </summary>
public class ContactFormModel
{
    [Required(ErrorMessage = "First Name is required.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last Name is required.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Contact Numbers is required.")]
    public string ContactNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email Address is required.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    public string EmailAddress { get; set; } = string.Empty;

    [Required(ErrorMessage = "Send Us Your Inquiries or Questions is required.")]
    [StringLength(4000, MinimumLength = 10, ErrorMessage = "Inquiries must be between 10 and 4000 characters.")]
    public string Inquiries { get; set; } = string.Empty;
}
