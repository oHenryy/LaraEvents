<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="API - Eventos")
 * @OA\SecurityScheme(
 *   securityScheme="sanctum",
 *   type="apiKey",
 *   in="header",
 *   name="Authorization",
 *   description="Enviar como: Bearer {token}"
 * )
 */
class EventApiController extends Controller
{
    /**
     * @OA\Get(path="/api/events", tags={"API - Eventos"}, summary="Listar eventos",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="Accept", in="header", @OA\Schema(type="string"), example="application/json"),
     *   @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *   @OA\Parameter(name="status", in="query", @OA\Schema(type="string")),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Event::where('user_id', $user->id);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return response()->json($query->orderBy('starts_at', 'desc')->paginate(10));
    }

    /**
     * @OA\Post(path="/api/events", tags={"API - Eventos"}, summary="Criar evento",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="Accept", in="header", @OA\Schema(type="string"), example="application/json"),
     *   @OA\RequestBody(required=true, @OA\JsonContent(
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
     *   )),
     *   @OA\Response(response=201, description="Criado")
     * )
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $event = Event::create($data);
        return response()->json($event, 201);
    }

    /**
     * @OA\Get(path="/api/events/{event}", tags={"API - Eventos"}, summary="Detalhar evento",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="Accept", in="header", @OA\Schema(type="string"), example="application/json"),
     *   @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="Não encontrado")
     * )
     */
    public function show(Request $request, Event $event): JsonResponse
    {
        $this->authorize('update', $event);
        return response()->json($event);
    }

    /**
     * @OA\Put(path="/api/events/{event}", tags={"API - Eventos"}, summary="Atualizar evento",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="Accept", in="header", @OA\Schema(type="string"), example="application/json"),
     *   @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\RequestBody(required=true, @OA\JsonContent(
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
     *   )),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="Não encontrado")
     * )
     */
    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        $this->authorize('update', $event);
        $event->update($request->validated());
        return response()->json($event);
    }

    /**
     * @OA\Delete(path="/api/events/{event}", tags={"API - Eventos"}, summary="Remover evento",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="Accept", in="header", @OA\Schema(type="string"), example="application/json"),
     *   @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=204, description="Sem conteúdo")
     * )
     */
    public function destroy(Request $request, Event $event): JsonResponse
    {
        $this->authorize('delete', $event);
        $event->delete();
        return response()->json(null, 204);
    }
}


