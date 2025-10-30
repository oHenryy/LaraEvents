import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ColorPicker } from '@/components/ui/color-picker';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const statusOptions = [
    { value: 'scheduled', label: 'Agendado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'done', label: 'Concluído' },
];

const visibilityOptions = [
    { value: 'private', label: 'Privado' },
    { value: 'public', label: 'Público' },
];

type EventItem = {
    id: number;
    title: string;
    description?: string | null;
    starts_at: string;
    ends_at?: string | null;
    all_day: boolean;
    location?: string | null;
    status: string;
    visibility: string;
    color?: string | null;
    capacity?: number | null;
};

export default function EventEdit() {
    const { props } = usePage<{ event: EventItem; [key: string]: unknown }>();
    const event = props.event;
    const { data, setData, put, processing, errors } = useForm<{
        title: string;
        description: string;
        starts_at: string;
        ends_at: string;
        all_day: boolean;
        location: string;
        status: string;
        visibility: string;
        color: string;
        capacity: number | '';
    }>({
        title: event.title ?? '',
        description: event.description ?? '',
        starts_at: event.starts_at?.slice(0, 16) ?? '',
        ends_at: event.ends_at ? event.ends_at.slice(0, 16) : '',
        all_day: event.all_day ?? false,
        location: event.location ?? '',
        status: event.status ?? 'scheduled',
        visibility: event.visibility ?? 'private',
        color: event.color || '#6366F1',
        capacity: event.capacity ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/events/${props.event.id}`);
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Eventos', href: '/events' }, { title: 'Editar', href: `/events/${props.event.id}/edit` }]}>
            <Head title="Editar Evento" />

            <div className="p-6">
                <form onSubmit={submit} className="space-y-6 max-w-3xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input 
                                id="title" 
                                value={data.title} 
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Nome do evento"
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea 
                                id="description" 
                                value={data.description} 
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descrição do evento..."
                                rows={4}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="all_day"
                                    checked={data.all_day}
                                    onCheckedChange={(checked) => setData('all_day', checked as boolean)}
                                />
                                <Label htmlFor="all_day" className="cursor-pointer">
                                    Dia inteiro
                                </Label>
                            </div>
                        </div>

                        {data.all_day ? (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="date">Data *</Label>
                                <Input 
                                    id="date" 
                                    type="date" 
                                    value={data.starts_at ? data.starts_at.split('T')[0] : ''} 
                                    onChange={(e) => {
                                        const dateValue = e.target.value;
                                        setData('starts_at', dateValue + 'T00:00');
                                        setData('ends_at', dateValue + 'T23:59');
                                    }} 
                                />
                                {errors.starts_at && <p className="text-sm text-red-500">{errors.starts_at}</p>}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="starts_at">Data e hora de início *</Label>
                                    <Input 
                                        id="starts_at" 
                                        type="datetime-local" 
                                        value={data.starts_at} 
                                        onChange={(e) => setData('starts_at', e.target.value)} 
                                    />
                                    {errors.starts_at && <p className="text-sm text-red-500">{errors.starts_at}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ends_at">Data e hora de término</Label>
                                    <Input 
                                        id="ends_at" 
                                        type="datetime-local" 
                                        value={data.ends_at} 
                                        onChange={(e) => setData('ends_at', e.target.value)} 
                                    />
                                    {errors.ends_at && <p className="text-sm text-red-500">{errors.ends_at}</p>}
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="location">Local</Label>
                            <Input 
                                id="location" 
                                value={data.location} 
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="Ex: Centro de Convenções"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacidade</Label>
                            <Input 
                                id="capacity" 
                                type="number" 
                                value={data.capacity} 
                                onChange={(e) => setData('capacity', e.target.value ? Number(e.target.value) : '')}
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="visibility">Visibilidade</Label>
                            <Select value={data.visibility} onValueChange={(value) => setData('visibility', value)}>
                                <SelectTrigger id="visibility" className="w-full">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {visibilityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.visibility && <p className="text-sm text-red-500">{errors.visibility}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Cor</Label>
                            <ColorPicker 
                                id="color" 
                                value={data.color} 
                                onChange={(e) => setData('color', e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <Link href="/events">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Salvar
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}


