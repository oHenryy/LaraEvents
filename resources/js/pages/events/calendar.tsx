import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBr from '@fullcalendar/core/locales/pt-br';

type EventItem = {
    id: number;
    title: string;
    starts_at: string;
    ends_at?: string | null;
    all_day: boolean;
    color?: string | null;
};

export default function EventsCalendar() {
    const { props } = usePage<{ events: EventItem[] }>();

    const events = props.events.map((e) => ({
        id: String(e.id),
        title: e.title,
        start: e.starts_at,
        end: e.ends_at ?? undefined,
        allDay: e.all_day,
        color: e.color ?? undefined,
        url: `/events/${e.id}/edit`,
    }));

    return (
        <AppLayout breadcrumbs={[{ title: 'Calendário', href: '/events/calendar' }]}>
            <Head title="Calendário" />
            <div className="p-4">
                <div className="rounded-xl border p-2">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                        locales={[ptBr]}
                        locale="pt-br"
                        firstDay={1}
                        buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' }}
                        dayHeaderFormat={{ weekday: 'short' }}
                        titleFormat={{ month: 'long', year: 'numeric' }}
                        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                        weekNumbers={false}
                        stickyHeaderDates
                        aspectRatio={1.5}
                        events={events}
                        height="auto"
                        eventDisplay="block"
                        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                        expandRows
                    />
                </div>
            </div>
        </AppLayout>
    );
}


