import '../css/app.css';
import './confirm';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'react-hot-toast';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const appName = import.meta.env.VITE_APP_NAME || 'MyPerpus';

// Initialize Laravel Echo (Pusher) when environment variables are provided.
if (import.meta.env.VITE_PUSHER_APP_KEY) {
    try {
        window.Pusher = Pusher;
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || undefined,
            forceTLS: import.meta.env.VITE_PUSHER_FORCE_TLS ? import.meta.env.VITE_PUSHER_FORCE_TLS === 'true' : true,
            encrypted: true,
        });
    } catch (e) {
        // non-fatal: app will continue without real-time features
        // eslint-disable-next-line no-console
        console.warn('Echo init failed', e);
    }
}

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#0a0a0a',
                            color: '#fafafa',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontFamily: 'Instrument Sans, sans-serif',
                        },
                        success: {
                            iconTheme: { primary: '#38a169', secondary: '#fafafa' },
                        },
                        error: {
                            iconTheme: { primary: '#e53e3e', secondary: '#fafafa' },
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#c9a84c',
        includeCSS: true,
        showSpinner: false,
    },
});
