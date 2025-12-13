


export type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type PaginatedDataList<DataType> = {
    data: DataType[];
    pagination: Pagination;
};