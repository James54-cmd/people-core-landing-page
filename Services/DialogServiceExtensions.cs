using MudBlazor;
using PeopleCoreLandingPage.Components.Shared;

namespace PeopleCoreLandingPage.Services;

/// <summary>
/// Helpers for launching shared dialogs, so call sites don't repeat the
/// <see cref="DialogOptions"/> configuration.
/// </summary>
public static class DialogServiceExtensions
{
    private static readonly DialogOptions ContactDialogOptions = new()
    {
        FullScreen = true,
        CloseButton = false,
        NoHeader = true,
        CloseOnEscapeKey = false
    };

    /// <summary>Opens the full-screen, slide-in contact dialog.</summary>
    public static Task<IDialogReference> ShowContactDialogAsync(this IDialogService dialogService)
        => dialogService.ShowAsync<ContactDialog>("", ContactDialogOptions);
}
