export interface TableState {
    pageIndex: number;
    pageSize: number;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    filterValue: string;
  }