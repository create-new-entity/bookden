import { Pagination, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import type { PaginatedDataList } from '../../types';
import { STACK_DEFAULT_GAP } from '../../constants';

type CustomPaginationProps<DataType> = {
    paginatedDataList: PaginatedDataList<DataType>;
    onPageChange: (page: number) => void;
    sx?: SxProps<Theme>;
};

const CustomPagination = <DataType,> (props: CustomPaginationProps<DataType>) => {
    const { paginatedDataList, onPageChange, sx } = props;
    return (
        <Stack sx={{ marginBottom: '1rem' }} direction={'column'} justifyContent={'center'} alignItems={'center'} gap={STACK_DEFAULT_GAP}>
            <Pagination
                sx={sx}
                count={paginatedDataList.pagination.totalPages}
                page={paginatedDataList.pagination.page}
                onChange={(_event, page) => {
                    onPageChange(page);
                }}
            />
            <Typography variant='body1' color='text.secondary'>
                Showing {paginatedDataList.pagination.total} results
            </Typography>
        </Stack>
    );
};

export default CustomPagination;