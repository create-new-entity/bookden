import { Pagination, type SxProps, type Theme } from '@mui/material';
import type { PaginatedDataList } from '../../types';

type CustomPaginationProps<DataType> = {
    paginatedDataList: PaginatedDataList<DataType>;
    onPageChange: (page: number) => void;
    sx?: SxProps<Theme>;
};

const CustomPagination = <DataType,> (props: CustomPaginationProps<DataType>) => {
    const { paginatedDataList, onPageChange, sx } = props;
    return (
        <Pagination
            sx={sx}
            count={paginatedDataList.pagination.totalPages}
            page={paginatedDataList.pagination.page}
            onChange={(_event, page) => {
                onPageChange(page);
            }}
        />
    );
};

export default CustomPagination;