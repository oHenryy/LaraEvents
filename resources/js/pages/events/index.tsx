import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { type PaginatedResponse } from '@/types';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/pagination';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Calendar, Plus, Search, Filter, X } from 'lucide-react';

type EventItem = {
    id: number;
    title: string;
    starts_at: string;
    ends_at?: string | null;
    all_day: boolean;
    status: string;
    location?: string | null;
};

interface PageProps {
    events: PaginatedResponse<EventItem>;
    filters: {
        search?: string;
        status?: string;
        location?: string;
        date_from?: string;
        date_to?: string;
        visibility?: string;
        all_day?: boolean;
        sort_by?: string;
        sort_order?: string;
    };
    [key: string]: unknown;
}

const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'scheduled', label: 'Agendado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'done', label: 'Concluído' },
];

const visibilityOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'private', label: 'Privados' },
    { value: 'public', label: 'Públicos' },
];

const sortByOptions = [
    { value: 'starts_at', label: 'Data de início' },
    { value: 'created_at', label: 'Data de criação' },
];

function getSortOrderOptions(sortBy: string) {
    if (sortBy === 'starts_at') {
        return [
            { value: 'asc', label: 'Mais próximos primeiro' },
            { value: 'desc', label: 'Mais distantes primeiro' },
        ];
    }
    // created_at
    return [
        { value: 'desc', label: 'Mais recentes primeiro' },
        { value: 'asc', label: 'Mais antigos primeiro' },
    ];
}

export default function EventsIndex() {
    const { props } = usePage<PageProps>();
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [search, setSearch] = useState(props.filters?.search ?? '');
    const [status, setStatus] = useState(
        props.filters?.status ? props.filters.status : 'all'
    );
    const [location, setLocation] = useState(props.filters?.location ?? '');
    const [dateFrom, setDateFrom] = useState(
        props.filters?.date_from ?? ''
    );
    const [dateTo, setDateTo] = useState(props.filters?.date_to ?? '');
    const [visibility, setVisibility] = useState(
        props.filters?.visibility ? props.filters.visibility : 'all'
    );
    const [allDay, setAllDay] = useState(props.filters?.all_day || false);
    
    // Determinar ordenação atual (padrão: eventos mais próximos primeiro)
    const currentSortBy = props.filters?.sort_by || 'starts_at';
    const currentSortOrder = props.filters?.sort_order || 'asc';
    const sortOrderOptions = getSortOrderOptions(currentSortBy);

    const hasActiveFilters =
        search ||
        (status && status !== 'all') ||
        location ||
        dateFrom ||
        dateTo ||
        (visibility && visibility !== 'all') ||
        allDay ||
        (currentSortBy !== 'starts_at' || currentSortOrder !== 'asc');

    function buildParams() {
        const params: Record<string, string | boolean | undefined> = {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            location: location || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            visibility: visibility !== 'all' ? visibility : undefined,
            all_day: allDay || undefined,
            sort_by: currentSortBy,
            sort_order: currentSortOrder,
        };
        return params;
    }

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get('/events', buildParams(), {
            preserveState: true,
            replace: true,
        });
    }

    function handleStatusChange(value: string) {
        setStatus(value);
        const statusParam = value !== 'all' ? value : undefined;
        router.get(
            '/events',
            { ...buildParams(), status: statusParam },
            { preserveState: true, replace: true }
        );
    }

    function handleLocationApply() {
        router.get('/events', buildParams(), {
            preserveState: true,
            replace: true,
        });
    }

    function handleDateChange(field: 'from' | 'to', value: string) {
        if (field === 'from') {
            setDateFrom(value);
        } else {
            setDateTo(value);
        }
        
        const newParams = { ...buildParams() };
        if (field === 'from') {
            newParams.date_from = value || undefined;
        } else {
            newParams.date_to = value || undefined;
        }
        
        router.get('/events', newParams, {
            preserveState: true,
            replace: true,
        });
    }

    function handleSortByChange(value: string) {
        // Quando muda o campo, reseta para a primeira opção de ordem desse campo
        const newSortBy = value;
        const newSortOrder = newSortBy === 'starts_at' ? 'asc' : 'desc';
        
        router.get(
            '/events',
            {
                ...buildParams(),
                sort_by: newSortBy,
                sort_order: newSortOrder,
            },
            { preserveState: true, replace: true }
        );
    }

    function handleSortOrderChange(value: string) {
        router.get(
            '/events',
            {
                ...buildParams(),
                sort_by: currentSortBy,
                sort_order: value,
            },
            { preserveState: true, replace: true }
        );
    }

    function clearFilters() {
        setSearch('');
        setStatus('all');
        setLocation('');
        setDateFrom('');
        setDateTo('');
        setVisibility('all');
        setAllDay(false);
        router.get(
            '/events',
            {},
            { preserveState: true, replace: true }
        );
    }

    function handleVisibilityChange(value: string) {
        setVisibility(value);
        const visibilityParam = value !== 'all' ? value : undefined;
        router.get(
            '/events',
            { ...buildParams(), visibility: visibilityParam },
            { preserveState: true, replace: true }
        );
    }

    function handleAllDayChange(checked: boolean) {
        setAllDay(checked);
        router.get(
            '/events',
            { ...buildParams(), all_day: checked || undefined },
            { preserveState: true, replace: true }
        );
    }

    function formatDateTime(dateString: string): string {
        try {
            return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
            });
        } catch {
            return new Date(dateString).toLocaleString('pt-BR');
        }
    }

    function getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'done':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            default:
                return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
        }
    }

    function getStatusLabel(status: string): string {
        switch (status) {
            case 'scheduled':
                return 'Agendado';
            case 'cancelled':
                return 'Cancelado';
            case 'done':
                return 'Concluído';
            default:
                return status;
        }
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Eventos', href: '/events' }]}>
            <Head title="Eventos" />

            <div className="space-y-6 p-6">
                {/* Header com título e ações */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Eventos
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gerencie todos os seus eventos em um só lugar
                        </p>
                    </div>
                    <Link href="/events/create">
                        <Button>
                            <Plus className="size-4" />
                            Novo evento
                        </Button>
                    </Link>
                </div>

                {/* Filtros */}
                <div className="space-y-4 rounded-xl border bg-card p-4">
                    {/* Filtros básicos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_160px_auto_auto_40px] gap-3 items-center">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="Buscar por título..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 w-full"
                                />
                            </div>
                            <Button type="submit" variant="outline" className="whitespace-nowrap shrink-0">
                                Buscar
                            </Button>
                        </form>

                        <Select value={status || 'all'} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2 rounded-md border bg-background px-2 py-1 shrink-0" style={{ width: 'fit-content' }}>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                Ordenar:
                            </span>
                            <div style={{ width: '130px' }}>
                                <Select value={currentSortBy || 'starts_at'} onValueChange={handleSortByChange}>
                                    <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-0 w-full h-7 p-0 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortByOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div style={{ width: '190px' }}>
                                <Select value={currentSortOrder || 'asc'} onValueChange={handleSortOrderChange}>
                                    <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-0 w-full h-7 p-0 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOrderOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="shrink-0"
                        >
                            <Filter className="size-4" />
                            <span className="ml-2">Filtros</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={clearFilters}
                            title="Limpar filtros"
                            className="shrink-0"
                            disabled={!hasActiveFilters}
                        >
                            <X className="size-4" />
                            <span className="sr-only">Limpar</span>
                        </Button>
                    </div>

                    {/* Filtros avançados */}
                    {showAdvancedFilters && (
                        <div className="grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_180px_180px_auto]">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Local
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Filtrar por local..."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleLocationApply();
                                            }
                                        }}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleLocationApply}
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Visibilidade
                                </label>
                                <Select value={visibility || 'all'} onValueChange={handleVisibilityChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {visibilityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Data inicial
                                </label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) =>
                                        handleDateChange('from', e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Data final
                                </label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) =>
                                        handleDateChange('to', e.target.value)
                                    }
                                    min={dateFrom || undefined}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    &nbsp;
                                </label>
                                <div className="flex items-center h-9">
                                    <Checkbox
                                        id="all_day"
                                        checked={allDay}
                                        onCheckedChange={(checked) => handleAllDayChange(checked as boolean)}
                                    />
                                    <label
                                        htmlFor="all_day"
                                        className="ml-2 text-sm font-medium leading-none cursor-pointer whitespace-nowrap"
                                    >
                                        Dia inteiro
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabela de eventos */}
                <div className="rounded-xl border bg-card">
                    {props.events.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Calendar className="mb-4 size-12 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">
                                Nenhum evento encontrado
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {hasActiveFilters
                                    ? 'Tente ajustar os filtros de busca.'
                                    : 'Comece criando seu primeiro evento.'}
                            </p>
                            {!hasActiveFilters && (
                                <Link href="/events/create" className="mt-4">
                                    <Button>Criar evento</Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed divide-y">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="w-[300px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Título
                                            </th>
                                            <th className="w-[180px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Data de início
                                            </th>
                                            <th className="w-[180px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Data de término
                                            </th>
                                            <th className="w-[200px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Local
                                            </th>
                                            <th className="w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Status
                                            </th>
                                            <th className="w-[100px] px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y bg-background">
                                        {props.events.data.map((event) => (
                                            <tr
                                                key={event.id}
                                                className="transition-colors hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-medium truncate max-w-[300px]" title={event.title}>
                                                        {event.title}
                                                    </div>
                                                    {event.all_day && (
                                                        <span className="mt-1 inline-flex text-xs text-muted-foreground">
                                                            Dia inteiro
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    {formatDateTime(
                                                        event.starts_at
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    {event.ends_at
                                                        ? formatDateTime(
                                                              event.ends_at
                                                          )
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {event.location ? (
                                                        <span className="truncate max-w-[200px] block" title={event.location}>
                                                            {event.location}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                                            event.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            event.status
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={`/events/${event.id}/edit`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        Editar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação */}
                            <Pagination pagination={props.events} />
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
