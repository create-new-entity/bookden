import { Pagination, type SxProps, type Theme } from '@mui/material';
import type { PaginatedDataList } from '../../types/Users';

type CustomPaginationProps<DataType> = {
    paginatedDataList: PaginatedDataList<DataType>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    sx?: SxProps<Theme>;
};

const CustomPagination = <DataType,> (props: CustomPaginationProps<DataType>) => {
    const { paginatedDataList, setPage, sx } = props;
    return (
        <Pagination
            sx={sx}
            count={paginatedDataList.pagination.totalPages}
            page={paginatedDataList.pagination.page}
            onChange={(_event, page) => {
                setPage(page);
            }}
        />
    );
};

export default CustomPagination;