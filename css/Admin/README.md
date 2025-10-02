# Admin CSS Styling Guidelines

This document provides guidelines for maintaining consistent styling across all admin pages.

## Base Styles

All admin pages should use `admin-base.css` as the foundation for styling. This file contains common elements such as:
- Layout structure
- Sidebar styling
- Content area styling
- Button styles
- Form elements
- Card components
- Table styles
- Status badges

## Color Palette

Use the following color palette consistently across all admin pages:

### Primary Colors
- Primary: `#333` (dark gray)
- Primary Hover: `#555` (medium gray)
- Text: `#333` (dark text)
- Secondary Text: `#666` (lighter text)
- Light Gray: `#f0f0f0`

### Status Colors
- Success: `#e8f5e9` (background), `#388e3c` (text)
- Warning: `#fff8e1` (background), `#f57c00` (text)
- Danger: `#ffebee` (background), `#d32f2f` (text)
- Info: `#e3f2fd` (background), `#1976d2` (text)

## Component Guidelines

### Cards
All card components should have:
- White background (`#fff`)
- Border radius of 8px
- Box shadow: `0 1px 3px rgba(0, 0, 0, 0.1)`
- Header with light gray background (`#f9f9f9`) when needed

### Tables
Tables should be styled with:
- Full width (100%)
- Light header background (`#fafafa`)
- Gray header text (`#666`)
- Subtle row separation with `#f0f0f0` bottom borders
- Hover state: `#f9f9f9` background

### Forms
Form elements should have:
- 10px padding
- 6px border radius
- Light border (`#ddd`)
- Focus state with dark border and subtle shadow

### Buttons
Use consistent button styling:
- Primary buttons: Dark background (`#333`)
- Secondary buttons: Light gray background with border
- 10px vertical / 16px horizontal padding
- 6px border radius

## Responsive Breakpoints

Use these consistent breakpoints for responsive design:
- 1100px: Adjust grid layouts (4 columns → 2 columns)
- 992px: Switch sidebar to top navigation
- 768px: Single column layouts, stack elements
- 576px: Adjust paddings, simplify tables

## Icons

Use Font Awesome icons consistently. For stat cards and feature indicators, use the appropriate icon colors from the color palette.

## Implementation Steps

1. Make sure all admin pages include both `main.css` and `admin-base.css`
2. Use the specific CSS file for unique page features
3. Follow the component guidelines for new elements
4. Test all changes at various screen sizes

For any questions about styling or to propose additions to these guidelines, please contact the design team. 