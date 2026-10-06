import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const getButtonArray = (
  totalPages: number,
  page: number,
): (number | "ellipsis-start" | "ellipsis-end")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  }
  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "ellipsis-start",
    page - 1,
    page,
    page + 1,
    "ellipsis-end",
    totalPages,
  ];
};

interface Props {
  totalPages: number;
  handlePageChange: (page: number) => void;
  page: number;
}

export default function TablePagination({
  totalPages,
  handlePageChange,
  page,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const go = (target: number) => {
    if (target >= 1 && target <= totalPages) {
      handlePageChange(target);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => go(page - 1)}
            aria-disabled={page === 1}
            className={
              page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
        {getButtonArray(totalPages, page).map((item) =>
          typeof item === "string" ? (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item} className="hidden sm:block">
              <PaginationLink
                onClick={() => go(item)}
                isActive={page === item}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem className="px-2 text-sm text-muted-foreground sm:hidden">
          {page} / {totalPages}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => go(page + 1)}
            aria-disabled={page === totalPages}
            className={
              page === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
