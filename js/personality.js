document.addEventListener('DOMContentLoaded', () => {
    // Skills Animation Logic
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                observer.unobserve(bar); // Only animate once
            }
        });
    };

    const skillObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.5
    });

    progressBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Simple scroll effect for navbar
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.background = "rgba(10,10,15,0.98)";
            nav.style.padding = "10px 40px";
        } else {
            nav.style.background = "rgba(10,10,15,0.9)";
            nav.style.padding = "0 40px";
        }
    });
});