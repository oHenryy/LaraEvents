<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Event;
use App\Http\Controllers\EventController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $userId = auth()->id();
        $now = now();
        $endOfWeek = now()->endOfWeek();
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $totalEvents = Event::where('user_id', $userId)->count();
        $todayEvents = Event::where('user_id', $userId)
            ->whereDate('starts_at', $now->toDateString())
            ->count();
        $weekEvents = Event::where('user_id', $userId)
            ->whereBetween('starts_at', [$now->copy()->startOfDay(), $endOfWeek])
            ->count();
        $monthEvents = Event::where('user_id', $userId)
            ->whereBetween('starts_at', [$startOfMonth, $endOfMonth])
            ->count();
        $nextEvent = Event::where('user_id', $userId)
            ->where('starts_at', '>=', $now)
            ->orderBy('starts_at')
            ->first();
        
        // Próximos eventos (até 5)
        $upcomingEvents = Event::where('user_id', $userId)
            ->where('starts_at', '>=', $now)
            ->orderBy('starts_at')
            ->limit(5)
            ->get(['id', 'title', 'starts_at', 'location', 'all_day']);
        
        // Eventos por status
        $eventsByStatus = Event::where('user_id', $userId)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('dashboard', [
            'stats' => [
                'total' => $totalEvents,
                'today' => $todayEvents,
                'thisWeek' => $weekEvents,
                'thisMonth' => $monthEvents,
                'scheduled' => $eventsByStatus['scheduled'] ?? 0,
                'cancelled' => $eventsByStatus['cancelled'] ?? 0,
                'done' => $eventsByStatus['done'] ?? 0,
            ],
            'nextEvent' => $nextEvent,
            'upcomingEvents' => $upcomingEvents,
        ]);
    })->name('dashboard');

    // Events
    Route::get('events', [EventController::class, 'index'])->name('events.index');
    Route::get('events/calendar', [EventController::class, 'calendar'])->name('events.calendar');
    Route::get('events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('events', [EventController::class, 'store'])->name('events.store');
    Route::get('events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::put('events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// L5 Swagger: rota para o JSON dos docs (compatibilidade com assinatura escalar)
Route::get('docs/{json?}', function (?string $json = null) {
    $file = $json ?: 'api-docs.json';
    $path = storage_path('api-docs/'.$file);
    abort_unless(file_exists($path), 404);
    return response()->file($path, ['Content-Type' => 'application/json']);
})->name('l5-swagger.default.docs');
