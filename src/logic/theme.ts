export class ThemeManager {
    constructor() {
        this.init();
        this.bindEvents();
    }

    private init(): void {
        const theme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (theme === 'dark' || (!theme && systemDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    private bindEvents(): void {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                console.log('🔵 Theme toggle button clicked!');
                this.toggle();
            });
            console.log('✓ Theme toggle button bound successfully');
        } else {
            console.error('✗ Theme toggle button (#theme-toggle) not found in DOM');
        }
    }

    public toggle(): void {
        console.log('🟢 Toggle method called');
        console.log('Current theme:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');

        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            console.log('➡️  Switched to LIGHT mode');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            console.log('➡️  Switched to DARK mode');
        }
    }
}
