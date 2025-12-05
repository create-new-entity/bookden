import { Pagination, type SxProps, type Theme } from '@mui/material';
import type { PaginatedDataList } from '../../types/Users';
import type { UserSearchParams } from '../../validations/userSearchParams';

type CustomPaginationProps<DataType> = {
    paginatedDataList: PaginatedDataList<DataType>;
    updateParams: (params: Partial<UserSearchParams>) => void;
    sx?: SxProps<Theme>;
};

const CustomPagination = <DataType,> (props: CustomPaginationProps<DataType>) => {
    const { paginatedDataList, updateParams, sx } = props;
    return (
        <Pagination
            sx={sx}
            count={paginatedDataList.pagination.totalPages}
            page={paginatedDataList.pagination.page}
            onChange={(_event, page) => {
                updateParams({ page });
            }}
        />
    );
};

export default CustomPagination;