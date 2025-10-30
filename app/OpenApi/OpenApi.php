<?php

namespace App\OpenApi;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *   version="1.0.0",
 *   title="LaraEvents API",
 *   description="Documentação Swagger dos endpoints principais do LaraEvents"
 * )
 * @OA\Server(
 *   url="http://127.0.0.1:8000",
 *   description="Servidor local"
 * )
 */
class OpenApi
{
    // Apenas para armazenar anotações OpenAPI

    /**
     * @OA\Schema(
     *   schema="Event",
     *   type="object",
     *   description="Evento do usuário",
     *   @OA\Property(property="id", type="integer", example=1),
     *   @OA\Property(property="user_id", type="integer", example=1),
     *   @OA\Property(property="title", type="string", example="Reunião de planejamento"),
     *   @OA\Property(property="description", type="string", nullable=true, example="Sprint 34"),
     *   @OA\Property(property="starts_at", type="string", format="date-time", example="2025-10-29T14:00:00Z"),
     *   @OA\Property(property="ends_at", type="string", format="date-time", nullable=true, example="2025-10-29T15:00:00Z"),
     *   @OA\Property(property="all_day", type="boolean", example=false),
     *   @OA\Property(property="location", type="string", nullable=true, example="Sala 2"),
     *   @OA\Property(property="status", type="string", example="scheduled"),
     *   @OA\Property(property="visibility", type="string", example="private"),
     *   @OA\Property(property="color", type="string", nullable=true, example="#FF0000"),
     *   @OA\Property(property="capacity", type="integer", nullable=true, example=10),
     *   @OA\Property(property="created_at", type="string", format="date-time"),
     *   @OA\Property(property="updated_at", type="string", format="date-time")
     * )
     */

    /**
     * @OA\Schema(
     *   schema="EventCreate",
     *   type="object",
     *   required={"title","starts_at"},
     *   @OA\Property(property="title", type="string"),
     *   @OA\Property(property="description", type="string", nullable=true),
     *   @OA\Property(property="starts_at", type="string", format="date-time"),
     *   @OA\Property(property="ends_at", type="string", format="date-time", nullable=true),
     *   @OA\Property(property="all_day", type="boolean"),
     *   @OA\Property(property="location", type="string", nullable=true),
     *   @OA\Property(property="status", type="string", enum={"scheduled","cancelled","done"}),
     *   @OA\Property(property="visibility", type="string", enum={"private","public"}),
     *   @OA\Property(property="color", type="string", nullable=true),
     *   @OA\Property(property="capacity", type="integer", nullable=true)
     * )
     */

    /**
     * @OA\Schema(
     *   schema="EventUpdate",
     *   type="object",
     *   @OA\Property(property="title", type="string"),
     *   @OA\Property(property="description", type="string", nullable=true),
     *   @OA\Property(property="starts_at", type="string", format="date-time"),
     *   @OA\Property(property="ends_at", type="string", format="date-time", nullable=true),
     *   @OA\Property(property="all_day", type="boolean"),
     *   @OA\Property(property="location", type="string", nullable=true),
     *   @OA\Property(property="status", type="string", enum={"scheduled","cancelled","done"}),
     *   @OA\Property(property="visibility", type="string", enum={"private","public"}),
     *   @OA\Property(property="color", type="string", nullable=true),
     *   @OA\Property(property="capacity", type="integer", nullable=true)
     * )
     */

    /**
     * @OA\Parameter(
     *   parameter="acceptJson",
     *   name="Accept",
     *   in="header",
     *   required=false,
     *   description="Força a resposta como JSON",
     *   @OA\Schema(type="string", default="application/json")
     * )
     */
}


