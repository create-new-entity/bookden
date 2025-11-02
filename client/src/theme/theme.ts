import { createTheme } from '@mui/material/styles';
import { customColors } from './colors';

type ThemeMode = 'light' | 'dark';

const disableRipple = {
    disableRipple: true,
    disableFocusRipple: true,
    disableTouchRipple: true
};

const getTheme = (mode: ThemeMode) => {
    return createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    primary: {
                        main: customColors.lightPrimaryMain,
                        light: customColors.lightPrimaryLight,
                        dark: customColors.lightPrimaryDark,
                        contrastText: customColors.lightPrimaryText,
                    },
                    secondary: {
                        main: customColors.lightSecondaryMain,
                        light: customColors.lightSecondaryLight,
                        dark: customColors.lightSecondaryDark,
                        contrastText: customColors.lightSecondaryText,
                    },
                    error: {
                        main: customColors.lightErrorMain,
                        light: customColors.lightErrorLight,
                        dark: customColors.lightErrorDark,
                        contrastText: customColors.lightErrorText,
                    },
                    warning: {
                        main: customColors.lightWarningMain,
                        light: customColors.lightWarningLight,
                        dark: customColors.lightWarningDark,
                        contrastText: customColors.lightWarningText,
                    },
                    info: {
                        main: customColors.lightInfoMain,
                        light: customColors.lightInfoLight,
                        dark: customColors.lightInfoDark,
                        contrastText: customColors.lightInfoText,
                    },
                    success: {
                        main: customColors.lightSuccessMain,
                        light: customColors.lightSuccessLight,
                        dark: customColors.lightSuccessDark,
                        contrastText: customColors.lightSuccessText,
                    },
                    background: {
                        default: customColors.lightBackgroundDefault,
                        paper: customColors.lightBackgroundPaper,
                    },
                    text: {
                        primary: customColors.lightTextPrimary,
                        secondary: customColors.lightTextSecondary,
                    },
                }
                : {
                    primary: {
                        main: customColors.darkPrimaryMain,
                        light: customColors.darkPrimaryLight,
                        dark: customColors.darkPrimaryDark,
                        contrastText: customColors.darkPrimaryText,
                    },
                    secondary: {
                        main: customColors.darkSecondaryMain,
                        light: customColors.darkSecondaryLight,
                        dark: customColors.darkSecondaryDark,
                        contrastText: customColors.darkSecondaryText,
                    },
                    error: {
                        main: customColors.darkErrorMain,
                        light: customColors.darkErrorLight,
                        dark: customColors.darkErrorDark,
                        contrastText: customColors.darkErrorText,
                    },
                    warning: {
                        main: customColors.darkWarningMain,
                        light: customColors.darkWarningLight,
                        dark: customColors.darkWarningDark,
                        contrastText: customColors.darkWarningText,
                    },
                    info: {
                        main: customColors.darkInfoMain,
                        light: customColors.darkInfoLight,
                        dark: customColors.darkInfoDark,
                        contrastText: customColors.darkInfoText,
                    },
                    success: {
                        main: customColors.darkSuccessMain,
                        light: customColors.darkSuccessLight,
                        dark: customColors.darkSuccessDark,
                        contrastText: customColors.darkSuccessText,
                    },
                    background: {
                        default: customColors.darkBackgroundDefault,
                        paper: customColors.darkBackgroundPaper,
                    },
                    text: {
                        primary: customColors.darkTextPrimary,
                        secondary: customColors.darkTextSecondary,
                    },
                }),
        },
        typography: {
            fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
            fontSize: 14,
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: (theme) => ({
                    html: {
                        scrollBehavior: 'smooth',
                    },
                    body: {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        fontFamily: theme.typography.fontFamily,
                        margin: 0,
                        padding: 0,
                        minHeight: '100vh',
                    },
                    a: {
                        textDecoration: 'none',
                        color: 'inherit',
                    },

                    // WebKit-based scrollbars (Chrome, Safari, Edge). Ignoring firefox for now.
                    '*::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: '#bdbdbd',
                        borderRadius: '4px',
                    },
                    '*::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#9e9e9e',
                    }
                }),
            },
            MuiButton: {
                defaultProps: {
                    ...disableRipple,
                    disableElevation: true
                }
            },
            MuiTab: {
                defaultProps: {
                    ...disableRipple
                }
            },
            MuiIconButton: {
                defaultProps: {
                    ...disableRipple
                }
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none'
                    }
                }
            }
        },
    });
};

const theme = getTheme('light');

export default theme;
