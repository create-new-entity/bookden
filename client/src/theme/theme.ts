import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#555555',
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
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
    },
});

export default theme;
