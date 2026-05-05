Broadcasting setup (Pusher or laravel-websockets)
-----------------------------------------------

To enable real-time review broadcasting you must configure a broadcast driver and provide credentials.

Example using Pusher (recommended for quick setup):

Add to your `.env`:

```
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=mt1
VITE_PUSHER_APP_KEY=your-key
VITE_PUSHER_APP_CLUSTER=mt1
VITE_PUSHER_FORCE_TLS=true
```

Then run:

```
php artisan config:clear
npm run dev     # or npm run build for production
```

If you prefer a self-hosted solution, install and configure `beyondcode/laravel-websockets` and follow its docs. Start the websocket server with:

```
php artisan websockets:serve
```

After configuring env and starting the websocket server (or using Pusher), open two browser windows and test creating a review — it should appear live in the other client.

