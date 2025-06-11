<?php

use Laravel\Sanctum\Sanctum;

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1,127.0.0.1:8000,::1')),
    'guard' => ['web'],
    'expiration' => null,
    'middleware' => [
        'verify_csrf_token' => \Laravel\Sanctum\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => \Illuminate\Cookie\Middleware\EncryptCookies::class,
    ],

];
