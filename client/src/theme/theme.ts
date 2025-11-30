import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

import { customColors } from '../constants';
import {
    BORDER_RADIUS,
    LARGE_SVG_ICON_FONT_SIZE,
    PLACE_HOLDER_AVATAR,
    PLACE_HOLDER_AVATAR_CARD_MEDIA_HEIGHT,
    PLACE_HOLDER_AVATAR_CARD_MEDIA_WIDTH
} from '../constants';

type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode) => {
    const theme = {
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
                        elevated: customColors.lightBackgroundSurface
                    },                      
                    text: {
                        primary: customColors.lightTextPrimary,
                        secondary: customColors.lightTextSecondary,
                    }
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
                        elevated: customColors.darkBackgroundSurface
                    },
                    text: {
                        primary: customColors.darkTextPrimary,
                        secondary: customColors.darkTextSecondary,
                    }
                }),
        }
    };
    const isLightMode = mode === 'light';
    const additionalThemeOptions: ThemeOptions = {
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
                    disableRipple: true,
                    disableFocusRipple: true,
                    disableTouchRipple: true,
                    disableElevation: true
                },
                styleOverrides: {
                    root: {
                        maxWidth: 'fit-content'
                    }
                }
            },
            MuiTab: {
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true,
                    disableTouchRipple: true
                }
            },
            MuiIconButton: {
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true,
                    disableTouchRipple: true
                }
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none'
                    }
                }
            },
            MuiPaper: {
                defaultProps: {
                    elevation: 0
                },
                styleOverrides: {
                    root: {
                        backgroundColor: theme.palette.background.paper
                    }
                }
            },
            MuiMenu: {
                defaultProps: {
                    autoFocus: false
                },
                styleOverrides: {
                    paper: {
                        backgroundColor: theme.palette.background.elevated,
                        boxShadow: 'none'
                    }
                },
            },
            MuiMenuItem: {
                defaultProps: {
                    disableRipple: true,
                    disableTouchRipple: true
                }
            },
            MuiListItemButton: {
                defaultProps: {
                    disableRipple: true,
                    disableTouchRipple: true
                }
            },
            MuiSwitch: {
                defaultProps: {
                    disableRipple: true,
                    disableFocusRipple: true,
                    disableTouchRipple: true
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        '&.Mui-disabled': {
                            backgroundColor: isLightMode ? customColors.lightActionDisabledBackground : customColors.darkActionDisabledBackground
                        }
                    }
                }
            },
            MuiSvgIcon: {
                styleOverrides: {
                    fontSizeLarge: {
                        fontSize: LARGE_SVG_ICON_FONT_SIZE
                    }
                }
            },
            MuiAutocomplete: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
                        borderRadius: '0.5rem'
                    },
                    paper: {
                        backgroundColor: theme.palette.background.elevated,
                    }
                }
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
                    }
                }
            },
            MuiCardMedia: {
                defaultProps: {
                    image: PLACE_HOLDER_AVATAR,
                    sx: {
                        width: PLACE_HOLDER_AVATAR_CARD_MEDIA_WIDTH,
                        height: PLACE_HOLDER_AVATAR_CARD_MEDIA_HEIGHT,
                        borderRadius: BORDER_RADIUS
                    }
                }
            },
            MuiPagination: {
                defaultProps: {
                    color: 'primary',
                    hideNextButton: true,
                    hidePrevButton: true,
                    shape: 'rounded',
                    variant: 'outlined'
                }
            },
            MuiChip: {
                styleOverrides: {
                    sizeSmall: {
                        fontSize: '0.6rem'
                    }
                }
            }
        }
    };

    return createTheme(theme, additionalThemeOptions);
};

export default getTheme('light');
