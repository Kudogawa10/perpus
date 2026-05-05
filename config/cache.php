<?php
// config/cache.php
return [
    // Default to file-based cache to avoid redis/phpredis dependency issues
    // during early boot in development environments.
    'default' => env('CACHE_STORE', 'file'),
    'stores'  => [
        'database' => ['driver' => 'database', 'connection' => env('DB_CACHE_CONNECTION'), 'table' => env('DB_CACHE_TABLE', 'cache'), 'lock_connection' => env('DB_CACHE_LOCK_CONNECTION'), 'lock_table' => env('DB_CACHE_LOCK_TABLE')],
        'file'     => ['driver' => 'file', 'path' => storage_path('framework/cache/data'), 'lock_path' => storage_path('framework/cache/data')],
        'redis'    => ['driver' => 'redis', 'connection' => env('REDIS_CACHE_CONNECTION', 'cache'), 'lock_connection' => env('REDIS_CACHE_LOCK_CONNECTION', 'default')],
        'array'    => ['driver' => 'array', 'serialize' => false],
    ],
    'prefix' => env('CACHE_PREFIX', 'myperpus_cache'),
];
