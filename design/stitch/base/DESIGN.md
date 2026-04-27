---
name: Vibrant SaaS Ecosystem
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3b4a3e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#6b7b6d'
  outline-variant: '#bacbbb'
  surface-tint: '#006d3c'
  primary: '#006d3c'
  on-primary: '#ffffff'
  primary-container: '#00e785'
  on-primary-container: '#006235'
  inverse-primary: '#00e383'
  secondary: '#005ab7'
  on-secondary: '#ffffff'
  secondary-container: '#0072e5'
  on-secondary-container: '#fefcff'
  tertiary: '#5f5e5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#ccc9c6'
  on-tertiary-container: '#555452'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#5bffa1'
  primary-fixed-dim: '#00e383'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#00522c'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#abc7ff'
  on-secondary-fixed: '#001b3f'
  on-secondary-fixed-variant: '#00458f'
  tertiary-fixed: '#e5e2de'
  tertiary-fixed-dim: '#c8c6c3'
  on-tertiary-fixed: '#1c1c1a'
  on-tertiary-fixed-variant: '#474744'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

This design system is built for a fast-paced, communication-centric SaaS environment. The brand personality is professional yet approachable, characterized by a "Vibrant Corporate" aesthetic. It balances the high-energy nature of real-time communication with the reliability expected of enterprise-grade software.

The visual style leans into **Modernism**, utilizing ample whitespace, a crisp light-mode-first interface, and high-quality iconography to reduce cognitive load. The goal is to evoke a sense of efficiency and clarity, making complex messaging workflows feel effortless. Key attributes include:
*   **Vibrancy:** Using high-saturation accents to guide user attention.
*   **Precision:** Sharp typographic alignment and consistent spacing.
*   **Approachability:** Utilizing soft corner radii to humanize the data-heavy interface.

## Colors

The color palette is anchored by a high-visibility green, synonymous with modern communication platforms. This primary color is used for key success states and primary calls to action. 

*   **Primary (#00E785):** Reserved for primary actions, growth indicators, and active communication statuses.
*   **Secondary (#007AF5):** Used for secondary interactions, links, and informational callouts to provide a professional contrast to the green.
*   **Neutral/Deep Charcoal (#1D1D1B):** Provides high-contrast legibility for typography and icon glyphs.
*   **Surface (#F6F6F6):** A soft, cool-gray background used to differentiate page sections without the harshness of pure white.
*   **Pure White (#FFFFFF):** Reserved for primary content containers and cards to ensure they "pop" against the surface background.

## Typography

This design system utilizes **Manrope** for all text elements. Manrope’s geometric yet readable nature makes it ideal for a modern SaaS platform.

The hierarchy is built on a clear contrast between bold, tight-tracked headlines and highly legible, spacious body text. Headers should use a heavier weight (Bold/ExtraBold) to establish a strong structural anchor for each page. Labels and utility text should remain at 14px or 12px for density, but maintain a Medium or SemiBold weight to ensure they are not lost in the interface.

## Layout & Spacing

This design system employs a **12-column fluid grid** for main dashboard views and a **fixed-width container** (1280px) for marketing or landing pages. 

The spacing logic follows an 8px rhythmic scale. Consistent vertical "stacks" ensure that related elements are grouped tightly, while distinct sections are separated by larger increments (32px or 64px) to provide visual breathing room.
*   **Gutter:** A standard 24px gutter provides enough separation for data-heavy cards.
*   **Padding:** Internal card padding should default to 24px (stack-md/lg hybrid) to maintain a premium, spacious feel.

## Elevation & Depth

To maintain a crisp and modern SaaS feel, the design system avoids heavy, muddy shadows. Instead, it uses **Ambient Shadows** and **Tonal Layering**:

1.  **Level 0 (Floor):** The #F6F6F6 surface.
2.  **Level 1 (Cards):** Pure white containers (#FFFFFF) with a very soft, high-diffusion shadow (8% opacity) and a subtle 1px border (#E0E0E0).
3.  **Level 2 (Dropdowns/Modals):** Floating elements with a more pronounced shadow (12% opacity) to indicate clear separation from the background.
4.  **Interactive States:** Buttons and interactive cards use a "lift" effect on hover, where the shadow slightly expands and the element may shift 1-2px upward.

## Shapes

The shape language is defined by **Rounded (0.5rem / 8px)** corners as the base unit. This ensures the interface feels approachable and modern without being overly "bubbly."

*   **Standard Components:** Buttons, input fields, and small cards use an 8px radius.
*   **Large Containers:** Main content cards or modals use a 16px radius (rounded-lg).
*   **System Elements:** Chips and tags use a fully pill-shaped radius for maximum distinction from interactive buttons.

## Components

### Buttons
*   **Primary:** Solid #00E785 background with #1D1D1B text. High-contrast, bold, 8px rounded corners.
*   **Secondary:** Solid #007AF5 background with #FFFFFF text.
*   **Ghost:** Transparent background with a 1px border of #1D1D1B and matching text.

### Input Fields
*   Standard height of 48px.
*   Light gray border (#D1D1D1) that transitions to #007AF5 (Secondary Blue) on focus.
*   Labels are positioned above the field in 14px SemiBold Manrope.

### Chips & Badges
*   Used for status (e.g., "Online", "Pending").
*   Pill-shaped with a low-opacity background of the status color (e.g., 10% green for "Success") and a high-opacity text of the same hue.

### Cards
*   Primary content vehicle. White background, 16px corner radius, and subtle 1px border. 
*   Header sections within cards should be separated by a light horizontal rule.

### Navigation
*   **Sidebar:** Deep charcoal (#1D1D1B) or crisp white. Active states marked by a 4px primary green vertical bar on the left edge of the menu item.
*   **Top Bar:** Minimalist, white, containing breadcrumbs and user profile actions.