import {
    IconButton,
    Paper,
    Stack,
    Typography,
    type SxProps,
    type Theme
} from '@mui/material';


type AdminToolCardProps = {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onClick: () => void;
    paperStyles: SxProps<Theme>;
    iconButtonStyles: SxProps<Theme>;
    iconAndTextStackStyles: SxProps<Theme>;
    'data-testid'?: string;
};


const AdminToolCard = (props: AdminToolCardProps) => {
    return (
        <IconButton onClick={props.onClick} sx={props.iconButtonStyles} data-testid={props['data-testid']}>
            <Paper sx={props.paperStyles} elevation={2}>
                <Stack sx={props.iconAndTextStackStyles} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                    {props.icon}
                    <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                        <Typography variant='h5'>{props.title}</Typography>
                        <Typography variant='subtitle1'>{props.subtitle}</Typography>
                    </Stack>
                </Stack>
            </Paper>
        </IconButton>
    );
};

export default AdminToolCard;