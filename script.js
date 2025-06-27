document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggler ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // --- Responsive Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');

        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        hamburger.classList.toggle('toggle');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
                links.forEach(link => link.style.animation = '');
            }
        });
    });

    // --- Procedural Background Music ---
    const musicToggleButton = document.getElementById('music-toggle');
    const musicOnIcon = document.getElementById('music-on-icon');
    const musicOffIcon = document.getElementById('music-off-icon');

    let audioContext, mainGainNode, isPlaying = false, isInitialized = false, scheduler;

    const notes = [
        261.63,  // C4
        293.66,  // D4
        329.63,  // E4
        392.00,  // G4
        440.00,  // A4
        493.88,  // B4
        523.25,  // C5
        659.25   // E5
    ];

    let noteIndex = 0;
    const tempo = 100; // BPM
    const noteDuration = 60 / tempo;

    function playNote(time) {
        if (!isPlaying) return;

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle'; // Soothing retro tone
        oscillator.frequency.setValueAtTime(notes[noteIndex % notes.length], time);

        const noteGain = audioContext.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.3, time + noteDuration * 0.1);
        noteGain.gain.linearRampToValueAtTime(0, time + noteDuration);

        oscillator.connect(noteGain);
        noteGain.connect(mainGainNode);

        oscillator.start(time);
        oscillator.stop(time + noteDuration);

        noteIndex += Math.floor(Math.random() * 2) + 1; // slight random variation
    }

    function scheduleNotes() {
        const currentTime = audioContext.currentTime;
        playNote(currentTime);
        scheduler = setTimeout(scheduleNotes, noteDuration * 1000);
    }

    function startMusic() {
        if (!isInitialized) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            mainGainNode = audioContext.createGain();
            mainGainNode.connect(audioContext.destination);
            isInitialized = true;
        }
        isPlaying = true;
        mainGainNode.gain.setValueAtTime(1, audioContext.currentTime);
        scheduleNotes();
        musicOnIcon.style.display = 'block';
        musicOffIcon.style.display = 'none';
    }

    function stopMusic() {
        isPlaying = false;
        if (mainGainNode) mainGainNode.gain.setValueAtTime(0, audioContext.currentTime);
        clearTimeout(scheduler);
        musicOnIcon.style.display = 'none';
        musicOffIcon.style.display = 'block';
    }

    musicToggleButton.addEventListener('click', () => {
        if (isPlaying) stopMusic();
        else startMusic();
    });

    // --- Scroll-Triggered Animations ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    const animatedElements = document.querySelectorAll('.main-content, .card, .checklist li');
    animatedElements.forEach(el => observer.observe(el));
});
