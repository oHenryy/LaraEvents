<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-10 days', '+30 days');
        $end = (clone $start)->modify('+'.rand(1, 4).' hours');

        return [
            'user_id' => User::factory(),
            'title' => ucfirst($this->faker->words(rand(2, 5), true)),
            'description' => $this->faker->boolean(60) ? $this->faker->sentence() : null,
            'starts_at' => $start,
            'ends_at' => $end,
            'all_day' => false,
            'location' => $this->faker->boolean(50) ? $this->faker->city() : null,
            'status' => 'scheduled',
            'visibility' => 'private',
            'color' => null,
            'capacity' => null,
            'meta' => null,
        ];
    }
}


