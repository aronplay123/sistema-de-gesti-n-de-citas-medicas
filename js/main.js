function showNotification(message, type='info') {
    const id = 'notif-'+Date.now();
    const n = document.createElement('div');
    n.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    n.role = 'alert';
    n.id = id;
    n.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    document.body.appendChild(n);
    setTimeout(()=>{const el=document.getElementById(id); if(el) el.remove()}, 3500);
}

// Animación al hacer scroll y tooltips
document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card');
        elements.forEach(el=>{
            const pos = el.getBoundingClientRect().top;
            if (pos < window.innerHeight/1.3) el.classList.add('fade-in');
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    const t = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    t.map(e=>new bootstrap.Tooltip(e));

    // In multi-page mode we do not auto-inject fragments. Keep SPA functions available if needed.

    // Fallback: asegurar que el botón Iniciar Sesión del navbar llame a toggleLogin()
    const navLogin = document.getElementById('navLoginBtn');
    if (navLogin) {
        navLogin.addEventListener('click', (ev) => {
            ev.preventDefault();
            toggleLogin();
        });
    }
});