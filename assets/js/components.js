class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebar-overlay');
        this.toggleButtons = document.querySelectorAll('[data-sidebar-toggle]');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleProfileImage();
        this.setActiveMenuItem();
    }

    setupEventListeners() {
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleSidebar());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.toggleSidebar();
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('-translate-x-full');
        this.overlay.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    }

    isOpen() {
        return !this.sidebar.classList.contains('-translate-x-full');
    }
}

// Export for use in other files
export { SidebarManager };
