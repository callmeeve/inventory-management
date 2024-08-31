import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
    rowCount: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rowCount }) => {
    return (
        <Table>
            <TableHeader>
                {[...Array(rowCount)].map((_, index) => (
                    <TableRow key={index}>
                        <TableHead>
                            <Skeleton className="h-4 w-3/4" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4 w-3/4" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4 w-3/4" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4 w-3/4" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4 w-3/4" />
                        </TableHead>
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {[...Array(rowCount)].map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-4" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableSkeleton;