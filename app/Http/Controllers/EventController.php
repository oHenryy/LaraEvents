<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * @OA\Tag(
 *   name="Eventos",
 *   description="Gestão de eventos do usuário"
 * )
 */
class EventController extends Controller
{
    /**
     * @OA\Get(
     *   path="/events",
     *   tags={"Eventos"},
     *   summary="Listar eventos (página Inertia)",
     *   description="Retorna a página com a lista paginada de eventos do usuário. Para API JSON, podemos expor rotas /api futuramente.",
     *   @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string"), description="Buscar por título, descrição ou local"),
     *   @OA\Parameter(name="status", in="query", required=false, @OA\Schema(type="string", enum={"scheduled", "cancelled", "done"}), description="Filtrar por status"),
     *   @OA\Response(response=200, description="Página renderizada"),
     *   @OA\Response(response=401, description="Não autenticado")
     * )
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Event::query()->where('user_id', $user->id);

        // Busca por texto
        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filtro por status
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        // Filtro por local
        if ($location = $request->string('location')->toString()) {
            $query->where('location', 'like', "%{$location}%");
        }

        // Filtro por intervalo de datas
        if ($dateFrom = $request->string('date_from')->toString()) {
            $query->where('starts_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->string('date_to')->toString()) {
            $query->where('starts_at', '<=', $dateTo . ' 23:59:59');
        }

        // Filtro por visibilidade
        if ($visibility = $request->string('visibility')->toString()) {
            $query->where('visibility', $visibility);
        }

        // Filtro por evento de dia inteiro
        if ($request->has('all_day')) {
            $query->where('all_day', true);
        }

        // Ordenação
        $sortBy = $request->string('sort_by', 'starts_at')->toString();
        $sortOrder = $request->string('sort_order', 'asc')->toString();

        switch ($sortBy) {
            case 'created_at':
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'starts_at':
            default:
                $query->orderBy('starts_at', $sortOrder);
                break;
        }

        $events = $query->paginate(10)->appends($request->query());

        $visibility = $request->string('visibility')->toString();
        $allDay = $request->boolean('all_day', false);

        return Inertia::render('events/index', [
            'events' => $events,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'location' => $location,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'visibility' => $visibility,
                'all_day' => $allDay,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * @OA\Get(
     *   path="/events/calendar",
     *   tags={"Eventos"},
     *   summary="Calendário de eventos (página Inertia)",
     *   @OA\Response(response=200, description="Página renderizada"),
     *   @OA\Response(response=401, description="Não autenticado")
     * )
     */
    public function calendar(Request $request): Response
    {
        $user = $request->user();

        $events = Event::query()
            ->where('user_id', $user->id)
            ->orderBy('starts_at')
            ->get();

        return Inertia::render('events/calendar', [
            'events' => $events,
        ]);
    }

    /**
     * @OA\Get(
     *   path="/events/create",
     *   tags={"Eventos"},
     *   summary="Formulário de criação (página Inertia)",
     *   @OA\Response(response=200, description="Página renderizada"),
     *   @OA\Response(response=401, description="Não autenticado")
     * )
     */
    public function create(): Response
    {
        return Inertia::render('events/create');
    }

    /**
     * @OA\Post(
     *   path="/events",
     *   tags={"Eventos"},
     *   summary="Criar evento",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"title","starts_at"},
     *       @OA\Property(property="title", type="string"),
     *       @OA\Property(property="description", type="string", nullable=true),
     *       @OA\Property(property="starts_at", type="string", format="date-time"),
     *       @OA\Property(property="ends_at", type="string", format="date-time", nullable=true),
     *       @OA\Property(property="all_day", type="boolean"),
     *       @OA\Property(property="location", type="string", nullable=true),
     *       @OA\Property(property="status", type="string", enum={"scheduled","cancelled","done"}),
     *       @OA\Property(property="visibility", type="string", enum={"private","public"}),
     *       @OA\Property(property="color", type="string", nullable=true),
     *       @OA\Property(property="capacity", type="integer", nullable=true)
     *     )
     *   ),
     *   @OA\Response(response=302, description="Redireciona para a lista"),
     *   @OA\Response(response=401, description="Não autenticado"),
     *   @OA\Response(response=422, description="Validação falhou")
     * )
     */
    public function store(StoreEventRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $data = $request->validated();
        $data['user_id'] = $user->id;
        Event::create($data);

        return redirect()->route('events.index')
            ->with('success', 'Evento criado com sucesso.');
    }

    /**
     * @OA\Get(
     *   path="/events/{event}/edit",
     *   tags={"Eventos"},
     *   summary="Formulário de edição (página Inertia)",
     *   @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Página renderizada"),
     *   @OA\Response(response=401, description="Não autenticado"),
     *   @OA\Response(response=403, description="Sem permissão"),
     *   @OA\Response(response=404, description="Não encontrado")
     * )
     */
    public function edit(Event $event): Response
    {
        $this->authorize('update', $event);
        return Inertia::render('events/edit', [
            'event' => $event,
        ]);
    }

    /**
     * @OA\Put(
     *   path="/events/{event}",
     *   tags={"Eventos"},
     *   summary="Atualizar evento",
     *   @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="title", type="string"),
     *       @OA\Property(property="description", type="string", nullable=true),
     *       @OA\Property(property="starts_at", type="string", format="date-time"),
     *       @OA\Property(property="ends_at", type="string", format="date-time", nullable=true),
     *       @OA\Property(property="all_day", type="boolean"),
     *       @OA\Property(property="location", type="string", nullable=true),
     *       @OA\Property(property="status", type="string", enum={"scheduled","cancelled","done"}),
     *       @OA\Property(property="visibility", type="string", enum={"private","public"}),
     *       @OA\Property(property="color", type="string", nullable=true),
     *       @OA\Property(property="capacity", type="integer", nullable=true)
     *     )
     *   ),
     *   @OA\Response(response=302, description="Redireciona para a lista"),
     *   @OA\Response(response=401, description="Não autenticado"),
     *   @OA\Response(response=403, description="Sem permissão"),
     *   @OA\Response(response=422, description="Validação falhou"),
     *   @OA\Response(response=404, description="Não encontrado")
     * )
     */
    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $this->authorize('update', $event);
        $event->update($request->validated());

        return redirect()->route('events.index')
            ->with('success', 'Evento atualizado com sucesso.');
    }

    /**
     * @OA\Delete(
     *   path="/events/{event}",
     *   tags={"Eventos"},
     *   summary="Remover evento",
     *   @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=302, description="Redireciona para a lista"),
     *   @OA\Response(response=401, description="Não autenticado"),
     *   @OA\Response(response=403, description="Sem permissão"),
     *   @OA\Response(response=404, description="Não encontrado")
     * )
     */
    public function destroy(Request $request, Event $event): RedirectResponse
    {
        $this->authorize('delete', $event);
        $event->delete();

        return redirect()->route('events.index')
            ->with('success', 'Evento removido com sucesso.');
    }
}


