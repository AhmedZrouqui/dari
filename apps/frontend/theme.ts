import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /**
   * The primary font for the application. Inter is a modern, highly legible
   * sans-serif font perfect for user interfaces.
   */
  fontFamily: 'Inter, sans-serif',

  /**
   * Our custom color palette designed to convey security, trust, and clarity.
   * We are defining colors from 0 (lightest) to 9 (darkest).
   */
  colors: {
    // Primary Blue: Represents stability, trust, and professionalism.
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6', // <-- Primary shade for buttons
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
    ],
    // Accent Teal: Used for secondary actions, highlights, and to add a modern touch.
    teal: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997', // <-- Accent shade
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b',
    ],
  },

  /**
   * Setting the primary color for the application. Mantine components
   * like Buttons and Links will use this color by default.
   */
  primaryColor: 'blue',
  primaryShade: 6, // We'll use the 7th shade of blue (index 6) as our main button color
});
