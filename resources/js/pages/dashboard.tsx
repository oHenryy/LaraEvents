import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Plus, CheckCircle2, XCircle, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type UpcomingEvent = {
    id: number;
    title: string;
    starts_at: string;
    location?: string | null;
    all_day: boolean;
};

type Props = {
    stats: { 
        total: number; 
        today: number; 
        thisWeek: number;
        thisMonth: number;
        scheduled: number;
        cancelled: number;
        done: number;
    };
    nextEvent?: {
        id: number;
        title: string;
        starts_at: string;
        location?: string | null;
    } | null;
    upcomingEvents: UpcomingEvent[];
};

export default function Dashboard() {
    const { props } = usePage<Props>();
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header com botão de criar evento */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Visão geral dos seus eventos
                        </p>
                    </div>
                    <Link href="/events/create">
                        <Button>
                            <Plus className="size-4 mr-2" />
                            Novo Evento
                        </Button>
                    </Link>
                </div>

                {/* Estatísticas principais */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Hoje</p>
                                    <p className="text-3xl font-semibold mt-1">{props.stats?.today ?? 0}</p>
                                </div>
                                <Calendar className="size-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Esta Semana</p>
                                    <p className="text-3xl font-semibold mt-1">{props.stats?.thisWeek ?? 0}</p>
                                </div>
                                <CalendarClock className="size-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                                    <p className="text-3xl font-semibold mt-1">{props.stats?.thisMonth ?? 0}</p>
                                </div>
                                <Clock className="size-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                                    <p className="text-3xl font-semibold mt-1">{props.stats?.total ?? 0}</p>
                                </div>
                                <CheckCircle2 className="size-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Estatísticas por status */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Agendados</p>
                                    <p className="text-2xl font-semibold mt-1">{props.stats?.scheduled ?? 0}</p>
                                </div>
                                <CheckCircle2 className="size-6 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                                    <p className="text-2xl font-semibold mt-1">{props.stats?.done ?? 0}</p>
                                </div>
                                <CheckCircle2 className="size-6 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Cancelados</p>
                                    <p className="text-2xl font-semibold mt-1">{props.stats?.cancelled ?? 0}</p>
                                </div>
                                <XCircle className="size-6 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid com Próximo evento e Próximos eventos */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Próximo evento destacado */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximo Evento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {props.nextEvent ? (
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">{props.nextEvent.title}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Clock className="size-4" />
                                            <span>
                                                {format(new Date(props.nextEvent.starts_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>
                                        {props.nextEvent.location && (
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <MapPin className="size-4" />
                                                <span>{props.nextEvent.location}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/events/${props.nextEvent.id}/edit`}>
                                        <Button variant="outline" className="w-full">
                                            Ver Detalhes
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="size-12 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-sm text-muted-foreground">Sem eventos próximos</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Lista de próximos eventos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Eventos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {props.upcomingEvents && props.upcomingEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {props.upcomingEvents.slice(0, 4).map((event) => (
                                        <Link key={event.id} href={`/events/${event.id}/edit`}>
                                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                                                <div className="mt-0.5">
                                                    <div className="size-2 rounded-full bg-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{event.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {event.all_day 
                                                            ? format(new Date(event.starts_at), "dd/MM/yyyy", { locale: ptBR })
                                                            : format(new Date(event.starts_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {props.upcomingEvents.length > 4 && (
                                        <Link href="/events">
                                            <Button variant="ghost" className="w-full">
                                                Ver Todos
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="size-12 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-sm text-muted-foreground">Nenhum evento agendado</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
