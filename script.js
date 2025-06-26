// script.js - V2 with Scroll Animations

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

    // --- Procedural Background Music (No changes here) ---
    const musicToggleButton = document.getElementById('music-toggle');
    const musicOnIcon = document.getElementById('music-on-icon');
    const musicOffIcon = document.getElementById('music-off-icon');
    let audioContext, mainGainNode, isPlaying = false, isInitialized = false, scheduler;
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let noteIndex = 0;
    const tempo = 140;
    const noteDuration = 60 / tempo;

    function playNote(time) {
        if (!isPlaying) return;
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(notes[noteIndex % notes.length], time);
        const noteGain = audioContext.createGain();
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.3, time + noteDuration * 0.1);
        noteGain.gain.linearRampToValueAtTime(0, time + noteDuration);
        oscillator.connect(noteGain);
        noteGain.connect(mainGainNode);
        oscillator.start(time);
        oscillator.stop(time + noteDuration);
        noteIndex++;
    }

    function scheduleNotes() {
        let currentTime = audioContext.currentTime;
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
        if(mainGainNode) mainGainNode.gain.setValueAtTime(0, audioContext.currentTime);
        clearTimeout(scheduler);
        musicOnIcon.style.display = 'none';
        musicOffIcon.style.display = 'block';
    }

    musicToggleButton.addEventListener('click', () => {
        if (isPlaying) stopMusic();
        else startMusic();
    });

    // --- NEW: Scroll-Triggered Animations ---
    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Find all elements to animate and start observing them
    const animatedElements = document.querySelectorAll('.main-content, .card, .checklist li');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});