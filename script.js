/* ==========================================================================
   MEGA CURSOS PLATFORM - JAVASCRIPT DASHBOARD LOGIC (SIMPLIFIED)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    const navTabs = document.querySelectorAll('.nav-tab');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const activeTabTitle = document.getElementById('active-tab-title');

    // ==========================================================================
    // SIDEBAR DRAWER TOGGLING
    // ==========================================================================
    
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    }
    
    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
    
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Close sidebar on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // ==========================================================================
    // TABS SYNCING & CONTENT RENDERING
    // ==========================================================================
    
    function switchTab(tabKey) {
        // Sync active class on horizontal tabs
        navTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabKey) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Sync active class on sidebar navigation links
        sidebarLinks.forEach(link => {
            if (link.getAttribute('data-sidebar-tab') === tabKey) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Map keys to readable text titles
        const tabTitles = {
            trilhas: 'Trilhas',
            cursos: 'Cursos',
            modulos: 'Módulos',
            aulas: 'Aulas',
            usuarios: 'Usuários',
            assinaturas: 'Assinaturas',
            certificados: 'Certificados'
        };
        
        // Update main page heading with active tab title
        if (tabTitles[tabKey]) {
            activeTabTitle.textContent = tabTitles[tabKey];
        }
    }
    
    // Horizontal sub-navbar tabs listeners
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.getAttribute('data-tab'));
        });
    });
    
    // Sidebar nav links listeners
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabKey = link.getAttribute('data-sidebar-tab');
            if (tabKey) {
                switchTab(tabKey);
                closeSidebar(); // Auto-close drawer on mobile layout
            }
        });
    });

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    // Bootstraps default view to 'trilhas'
    switchTab('trilhas');
});
