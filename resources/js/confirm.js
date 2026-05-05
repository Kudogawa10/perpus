// Lightweight global confirm modal helper
// Exposes: window.confirmAction(message, { title, okText, cancelText }) -> Promise<boolean>
(function () {
    if (typeof window === 'undefined') return;
    if (window.confirmAction) return;

    function createModal(message, opts = {}) {
        const { title = 'Konfirmasi', okText = 'Ya', cancelText = 'Batal' } = opts;
        const container = document.createElement('div');
        container.className = 'confirm-overlay fixed inset-0 z-50 flex items-center justify-center p-4';
        container.style.background = 'rgba(0,0,0,0.5)';

        container.innerHTML = `
            <div class="card p-6 max-w-sm w-full">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <svg class="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm2 3h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9z"/></svg>
                    </div>
                    <div>
                        <p class="font-semibold text-perpus-black dark:text-perpus-white">${title}</p>
                        <p class="text-xs text-perpus-gray-400">Tindakan ini tidak dapat dibatalkan</p>
                    </div>
                </div>
                <p class="text-sm text-perpus-gray-600 dark:text-perpus-gray-400 mb-6">${message}</p>
                <div class="flex gap-3">
                    <button data-confirm-cancel class="btn-secondary flex-1">${cancelText}</button>
                    <button data-confirm-ok class="btn-danger flex-1">${okText}</button>
                </div>
            </div>
        `;

        return container;
    }

    window.confirmAction = function (message, opts = {}) {
        return new Promise((resolve) => {
            try {
                const modal = createModal(message, opts);
                const okBtn = modal.querySelector('[data-confirm-ok]');
                const cancelBtn = modal.querySelector('[data-confirm-cancel]');

                function cleanup(result) {
                    try { document.body.removeChild(modal); } catch (e) {}
                    okBtn.removeEventListener('click', onOk);
                    cancelBtn.removeEventListener('click', onCancel);
                    resolve(result);
                }

                function onOk(e) { e?.preventDefault(); cleanup(true); }
                function onCancel(e) { e?.preventDefault(); cleanup(false); }

                okBtn.addEventListener('click', onOk);
                cancelBtn.addEventListener('click', onCancel);

                // allow ESC to cancel
                function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); cleanup(false); } }
                document.addEventListener('keydown', onKey, { once: true });

                document.body.appendChild(modal);
            } catch (err) {
                // fallback to native confirm if anything goes wrong
                // eslint-disable-next-line no-alert
                const res = typeof window !== 'undefined' ? confirm(message) : true;
                resolve(!!res);
            }
        });
    };
})();
