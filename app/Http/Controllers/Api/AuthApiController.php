<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthApiController extends Controller
{
    /**
     * @OA\Post(path="/api/token/login", tags={"API - Auth"}, summary="Gerar token (login)",
     *   @OA\Parameter(name="Accept", in="header", @OA\Schema(type="string"), example="application/json"),
     *   @OA\RequestBody(required=true, @OA\JsonContent(
     *     required={"email","password"},
     *     @OA\Property(property="email", type="string", format="email", example="test@example.com"),
     *     @OA\Property(property="password", type="string", example="password"),
     *     @OA\Property(property="device_name", type="string", example="swagger")
     *   )),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=422, description="Credenciais inválidas")
     * )
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['sometimes', 'string']
        ]);

        /** @var User|null $user */
        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $token = $user->createToken($data['device_name'] ?? 'api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * @OA\Post(path="/api/token/logout", tags={"API - Auth"}, summary="Revogar token (logout)",
     *   security={{"sanctum":{}}},
     *   @OA\Parameter(name="Accept", in="header", @OA\Schema(type="string"), example="application/json"),
     *   @OA\Response(response=204, description="Sem conteúdo")
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(null, 204);
    }
}


