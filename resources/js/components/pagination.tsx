import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type PaginatedResponse } from '@/types';

interface PaginationProps {
    pagination: PaginatedResponse<unknown>;
}

export function Pagination({ pagination }: PaginationProps) {
    const { links, current_page, last_page } = pagination;

    if (last_page <= 1) {
        return null;
    }

    const pageLinks = links.filter((link) => {
        if (!link.url) return false;
        // Skip previous/next labels, keep only page numbers and "..."
        const isPageNumber = /^\d+$/.test(link.label.trim());
        const isEllipsis = link.label.trim() === '...';
        return isPageNumber || isEllipsis;
    });

    return (
        <div className="flex items-center justify-between gap-2 px-4 py-4">
            <div className="text-sm text-muted-foreground">
                Mostrando {pagination.from} até {pagination.to} de {pagination.total} eventos
            </div>

            <div className="flex items-center gap-1">
                {pagination.prev_page_url && (
                    <Link href={pagination.prev_page_url}>
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="size-4" />
                            <span className="sr-only">Anterior</span>
                        </Button>
                    </Link>
                )}

                <div className="flex items-center gap-1">
                    {pageLinks.map((link, index) => {
                        if (!link.url) {
                            return (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 text-sm text-muted-foreground"
                                >
                                    {link.label}
                                </span>
                            );
                        }

                        const isActive = link.active;
                        const pageNum = parseInt(link.label.trim());

                        return (
                            <Link key={index} href={link.url}>
                                <Button
                                    variant={isActive ? 'default' : 'outline'}
                                    size="sm"
                                    className={cn(
                                        'min-w-9',
                                        isActive && 'pointer-events-none'
                                    )}
                                >
                                    {link.label}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                {pagination.next_page_url && (
                    <Link href={pagination.next_page_url}>
                        <Button variant="outline" size="sm">
                            <ChevronRight className="size-4" />
                            <span className="sr-only">Próximo</span>
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

