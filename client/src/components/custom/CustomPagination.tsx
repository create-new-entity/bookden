import { Pagination, Stack, TextField, Typography, type SxProps, type Theme } from '@mui/material';
import type { PaginatedDataList } from '../../types';
import { STACK_DEFAULT_GAP } from '../../constants';
import { useState } from 'react';
import { useResponsive } from '../../hooks';

type CustomPaginationProps<DataType> = {
    paginatedDataList: PaginatedDataList<DataType>;
    onPageChange: (page: number) => void;
    sx?: SxProps<Theme>;
};

const CustomPagination = <DataType,> (props: CustomPaginationProps<DataType>) => {
    const { paginatedDataList, onPageChange, sx } = props;
    const [_jumpToPage, setJumpToPage] = useState('');
    const { isMobile } = useResponsive();
    
    return (
        <Stack sx={{ marginBottom: '1rem' }} direction={'column'} justifyContent={'center'} alignItems={'center'} gap={STACK_DEFAULT_GAP}>
            <Pagination
                showFirstButton={!isMobile}
                showLastButton={!isMobile}
                hideNextButton={isMobile}
                hidePrevButton={isMobile}
                sx={sx}
                count={paginatedDataList.pagination.totalPages}
                page={paginatedDataList.pagination.page}
                onChange={(_event, page) => {
                    onPageChange(page);
                }}
            />
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={STACK_DEFAULT_GAP}>
                <Typography>
                    Jump to page:
                </Typography>
                <TextField
                    sx={{ width: '3rem' }}
                    onChange={(event) => {
                        setJumpToPage(event.target.value);
                    }}
                    onBlur={(event) => {
                        if(isNaN(parseInt(event.target.value, 10))) {
                            setJumpToPage('');
                            return;
                        }
                        let newPage = parseInt(event.target.value, 10);
                        if(newPage < 1) {
                            newPage = 1;
                        }
                        if(newPage > paginatedDataList.pagination.totalPages) {
                            newPage = paginatedDataList.pagination.totalPages;
                        }
                        setJumpToPage(newPage.toString());
                        onPageChange(newPage);
                    }}
                    onKeyDown={(event) => {
                        if(event.key === 'Enter') {
                            event.preventDefault();
                            (event.target as HTMLInputElement).blur();
                        }
                    }}
                />
            </Stack>
            <Typography variant='body1' color='text.secondary'>
                Showing {paginatedDataList.pagination.total} results
            </Typography>
        </Stack>
    );
};

export default CustomPagination;