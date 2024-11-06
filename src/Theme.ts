import { createContext, useState, useMemo } from "react";
import { createTheme, PaletteMode } from "@mui/material/styles";

// Color design tokens with green shades for accent
export const tokens = (mode: string) => ({
    ...(mode === "dark"
        ? {
              grey: {
                  100: "#e7e7e7",
                  200: "#d0d0d0",
                  300: "#b8b8b8",
                  400: "#a1a1a1",
                  500: "#898989",
                  600: "#6e6e6e",
                  700: "#525252",
                  800: "#373737",
                  900: "#1b1b1b",
              },
              primary: {
                  100: "#707070",
                  200: "#5B5B5B",
                  300: "#474747",
                  400: "#323232",
                  500: "#1E1E1E",
                  600: "#020202",
                  700: "#000000",
                  800: "#000000",
                  900: "#000000",
              },
              accent: {
                  100: "#A9F0A9",
                  200: "#83E683",
                  300: "#5CDC5C",
                  400: "#36D336",
                  500: "#0FCF0F", // Main green accent
                  600: "#0B9F0B",
                  700: "#086F08",
                  800: "#054F05",
                  900: "#023302",
              },
          }
        : {
              grey: {
                  100: "#141414",
                  200: "#292929",
                  300: "#3d3d3d",
                  400: "#525252",
                  500: "#666666",
                  600: "#858585",
                  700: "#a3a3a3",
                  800: "#c2c2c2",
                  900: "#e0e0e0",
              },
              primary: {
                  100: "#040509",
                  200: "#080b12",
                  300: "#0c101b",
                  400: "#f2f0f0",  // Light mode primary
                  500: "#141b2d",
                  600: "#434957",
                  700: "#727681",
                  800: "#a1a4ab",
                  900: "#d0d1d5",
              },
              accent: {
                  100: "#A9F0A9",
                  200: "#83E683",
                  300: "#5CDC5C",
                  400: "#36D336",
                  500: "#0FCF0F", // Main green accent
                  600: "#0B9F0B",
                  700: "#086F08",
                  800: "#054F05",
                  900: "#023302",
              },
          }),
});

// Material UI theme settings
export const themeSettings = (mode: string) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode as PaletteMode,
            ...(mode === "dark"
                ? {
                      primary: {
                          main: colors.primary[500],
                      },
                      secondary: {
                          main: colors.accent[500],
                      },
                      neutral: {
                          dark: colors.grey[700],
                          main: colors.grey[500],
                          light: colors.grey[100],
                      },
                      background: {
                          default: colors.primary[500],
                      },
                  }
                : {
                      primary: {
                          main: colors.primary[100],
                      },
                      secondary: {
                          main: colors.accent[500],
                      },
                      neutral: {
                          dark: colors.grey[700],
                          main: colors.grey[500],
                          light: colors.grey[100],
                      },
                      background: {
                          default: "#fcfcfc",
                      },
                  }),
        },
        typography: {
            fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};

// Context for color mode
export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

// Custom hook for managing the theme mode and providing the theme
export const useMode = () => {
    const [mode, setMode] = useState("light"); // Set default mode to "light"

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return [theme, colorMode];
};
