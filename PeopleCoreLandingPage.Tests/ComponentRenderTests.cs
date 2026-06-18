using Bunit;
using Microsoft.Extensions.DependencyInjection;
using MudBlazor.Services;
using PeopleCoreLandingPage.Components.Layout;
using PeopleCoreLandingPage.Components.Sections;
using PeopleCoreLandingPage.Components.Shared;

namespace PeopleCoreLandingPage.Tests;

/// <summary>
/// Render smoke tests — they assert key components render their expected content
/// without throwing. MudBlazor needs its services registered and a loose JSInterop.
/// </summary>
public class ComponentRenderTests : BunitContext
{
    public ComponentRenderTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Footer_renders_nav_and_legal_links()
    {
        var cut = Render<Footer>();

        Assert.Contains("Software as a Service", cut.Markup);
        Assert.Contains("Privacy Notice", cut.Markup);
        Assert.Contains("Terms of Service", cut.Markup);
    }

    [Fact]
    public void Hero_renders_headline_and_copy()
    {
        var cut = Render<Hero>();

        Assert.Contains("workforce", cut.Markup);
        Assert.Contains("Empower your workforce", cut.Markup);
    }

    [Fact]
    public void ContactForm_renders_form_fields()
    {
        var cut = Render<ContactForm>();

        Assert.Contains("Send us a message", cut.Markup);
        Assert.Contains("Contact Us", cut.Markup);
    }

    [Fact]
    public void ContactForm_without_OnClose_renders_home_links_not_close_buttons()
    {
        var cut = Render<ContactForm>();

        // Page mode (no OnClose): the logo/exit are anchors back home, not buttons.
        Assert.Contains(cut.FindAll("a.contact-logo"), _ => true);
        Assert.Empty(cut.FindAll("button.contact-logo"));
    }
}
