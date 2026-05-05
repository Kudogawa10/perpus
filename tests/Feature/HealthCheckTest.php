<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_application_can_return_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
