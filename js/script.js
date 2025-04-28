// Global Variables
let backgroundMusic;
let currentSong = 0;
let songs = [
    { title: "Our Special Song", artist: "The soundtrack of our love", src: "assets/music/song1.mp3" },
    { title: "Forever With You", artist: "Love Melodies", src: "assets/music/song2.mp3" },
    { title: "Birthday Wishes", artist: "Celebration Tunes", src: "assets/music/song3.mp3" }
];
let player;
let isPlaying = false;
let progress;
let currentTimeDisplay;
let totalTimeDisplay;

// Document Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    progress = document.querySelector('.progress');
    currentTimeDisplay = document.getElementById('current-time');
    totalTimeDisplay = document.getElementById('total-time');
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: false,
        mirror: false
    });

    // Initialize Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 30,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ff6b95"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 250,
                        "size": 6,
                        "duration": 2,
                        "opacity": 0.8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // Initialize Swiper for Quotes
    if (document.querySelector('.swiper-quotes')) {
        new Swiper('.swiper-quotes', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }
        });
    }

    // Initialize Audio
    initBackgroundMusic();
    initMusicPlayer();

    // Setup Event Listeners
    setupEventListeners();

    // Create Floating Hearts
    createFloatingHearts();
    
    // Create Bubbles
    createBubbles();
    
    // Initialize Polaroid Wall
    initPolaroidWall();
    
    // Initialize Secret Section
    initSecretSection();
    
    // Fix overlapping text
    fixOverlappingText();
    window.addEventListener('resize', fixOverlappingText);

    // Hide Preloader
    setTimeout(function() {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('preloader').style.display = 'none';
        }, 500);
    }, 1500);
});

// Fix Overlapping Text
function fixOverlappingText() {
    const windowWidth = window.innerWidth;
    const titleElements = document.querySelectorAll('.hero-title, .section-title h2');
    
    titleElements.forEach(element => {
        if (windowWidth < 768) {
            const fontSize = Math.max(windowWidth / 15, 28);
            element.style.fontSize = fontSize + 'px';
        } else {
            element.style.fontSize = '';
        }
    });
}

// Initialize Background Music
function initBackgroundMusic() {
    backgroundMusic = new Howl({
        src: ['assets/music/background-music.mp3'],
        loop: true,
        volume: 0.4,
        autoplay: false,
        preload: true,
    });
}

// Initialize Music Player
function initMusicPlayer() {
    player = new Howl({
        src: [songs[currentSong].src],
        html5: true,
        volume: 0.7,
        preload: true,
        onplay: function() {
            requestAnimationFrame(updateProgress);
            document.getElementById('player-play').innerHTML = '<i class="fas fa-pause"></i>';
            animateMusicNotes(true);
            isPlaying = true;
        },
        onpause: function() {
            document.getElementById('player-play').innerHTML = '<i class="fas fa-play"></i>';
            animateMusicNotes(false);
            isPlaying = false;
        },
        onstop: function() {
            document.getElementById('player-play').innerHTML = '<i class="fas fa-play"></i>';
            animateMusicNotes(false);
            isPlaying = false;
        },
        onend: function() {
            nextSong();
        },
        onload: function() {
            updateSongDuration();
        }
    });
}

// Update Song Duration
function updateSongDuration() {
    let duration = player.duration();
    totalTimeDisplay.textContent = formatTime(duration);
}

// Format Time for Display
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}

// Update Progress Bar
function updateProgress() {
    let seek = player.seek();
    let duration = player.duration();
    let progressPercentage = (seek / duration) * 100;
    progress.style.width = progressPercentage + '%';
    currentTimeDisplay.textContent = formatTime(seek);
    
    if (isPlaying) {
        requestAnimationFrame(updateProgress);
    }
}

// Play/Pause Song
function togglePlay() {
    if (!player.playing()) {
        player.play();
    } else {
        player.pause();
    }
}

// Next Song
function nextSong() {
    player.stop();
    currentSong = (currentSong + 1) % songs.length;
    updatePlayerDisplay();
    player = new Howl({
        src: [songs[currentSong].src],
        html5: true,
        volume: 0.7,
        onplay: function() {
            requestAnimationFrame(updateProgress);
            document.getElementById('player-play').innerHTML = '<i class="fas fa-pause"></i>';
            animateMusicNotes(true);
            isPlaying = true;
        },
        onpause: function() {
            document.getElementById('player-play').innerHTML = '<i class="fas fa-play"></i>';
            animateMusicNotes(false);
            isPlaying = false;
        },
        onstop: function() {
            document.getElementById('player-play').innerHTML = '<i class="fas fa-play"></i>';
            animateMusicNotes(false);
            isPlaying = false;
        },
        onend: function() {
            nextSong();
        },
        onload: function() {
            updateSongDuration();
            player.play();
        }
    });
}

// Previous Song
function prevSong() {
    player.stop();
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    updatePlayerDisplay();
    player = new Howl({
        src: [songs[currentSong].src],
        html5: true,
        volume: 0.7,
        onplay: function() {
            requestAnimationFrame(updateProgress);
            document.getElementById('player-play').innerHTML = '<i class="fas fa-pause"></i>';
            animateMusicNotes(true);
            isPlaying = true;
        },
        onpause: function() {
            document.getElementById('player-play').innerHTML = '<i class="fas fa-play"></i>';
            animateMusicNotes(false);
            isPlaying = false;
        },
        onstop: function() {
            document.getElementById('player-play').innerHTML = '<i class="fas fa-play"></i>';
            animateMusicNotes(false);
            isPlaying = false;
        },
        onend: function() {
            nextSong();
        },
        onload: function() {
            updateSongDuration();
            player.play();
        }
    });
}

// Update Player Display
function updatePlayerDisplay() {
    document.querySelector('.song-title').textContent = songs[currentSong].title;
    document.querySelector('.song-artist').textContent = songs[currentSong].artist;
}

// Animate Music Notes
function animateMusicNotes(play) {
    const notes = document.querySelectorAll('.music-notes i');
    notes.forEach((note, index) => {
        if (play) {
            note.style.animation = `float 1.${index + 1}s ease-in-out infinite`;
            note.style.opacity = '1';
        } else {
            note.style.animation = 'none';
            note.style.opacity = '0.3';
        }
    });
}

// Create Floating Hearts
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floating-hearts');
    if (!heartsContainer) return;

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = 15 + Math.random() * 10 + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.opacity = 0.1 + Math.random() * 0.5;
        heart.style.fontSize = 10 + Math.random() * 20 + 'px';
        heartsContainer.appendChild(heart);
    }
}

// Create Bubbles
function createBubbles() {
    const bubblesContainer = document.querySelector('.bubbles');
    if (!bubblesContainer) return;
    
    const bubbles = bubblesContainer.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        const size = Math.random() * 60 + 20;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        bubble.style.animationDuration = 5 + Math.random() * 10 + 's';
    });
}

// Initialize Polaroid Wall
function initPolaroidWall() {
    const polaroids = document.querySelectorAll('.polaroid');
    const modal = document.querySelector('.polaroid-modal');
    const modalImg = document.querySelector('.polaroid-modal-img');
    const modalCaption = document.querySelector('.polaroid-modal-caption');
    const closeBtn = document.querySelector('.polaroid-close');
    
    if (!polaroids.length || !modal) return;
    
    polaroids.forEach(polaroid => {
        polaroid.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.getAttribute('data-caption');
            
            modalImg.src = img.src;
            modalCaption.textContent = caption;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize Secret Section
function initSecretSection() {
    const secretHint = document.getElementById('secret-hint');
    const secretSection = document.getElementById('secret-section');
    const closeSecret = document.getElementById('close-secret');
    
    if (!secretHint || !secretSection || !closeSecret) return;
    
    secretHint.addEventListener('click', function() {
        secretSection.classList.add('show');
        setTimeout(() => {
            secretSection.querySelector('.secret-content').style.opacity = '1';
            secretSection.querySelector('.secret-content').style.transform = 'translateY(0)';
        }, 100);
        document.body.style.overflow = 'hidden';
    });
    
    closeSecret.addEventListener('click', function() {
        secretSection.querySelector('.secret-content').style.opacity = '0';
        secretSection.querySelector('.secret-content').style.transform = 'translateY(50px)';
        setTimeout(() => {
            secretSection.classList.remove('show');
            document.body.style.overflow = 'auto';
        }, 500);
    });
    
    // Also trigger when user scrolls to bottom
    window.addEventListener('scroll', function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            // Only trigger once
            if (!sessionStorage.getItem('secretShown')) {
                setTimeout(() => {
                    secretSection.classList.add('show');
                    setTimeout(() => {
                        secretSection.querySelector('.secret-content').style.opacity = '1';
                        secretSection.querySelector('.secret-content').style.transform = 'translateY(0)';
                    }, 100);
                    document.body.style.overflow = 'hidden';
                    sessionStorage.setItem('secretShown', 'true');
                }, 1000);
            }
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Audio Control
    const audioControl = document.getElementById('audio-control');
    if (audioControl) {
        audioControl.addEventListener('click', function() {
            const audioIcon = document.getElementById('audio-icon');
            if (backgroundMusic.playing()) {
                backgroundMusic.pause();
                audioIcon.classList.remove('fa-volume-up');
                audioIcon.classList.add('fa-volume-mute');
            } else {
                backgroundMusic.play();
                audioIcon.classList.remove('fa-volume-mute');
                audioIcon.classList.add('fa-volume-up');
            }
        });
    }

    // Music Player Controls
    const playBtn = document.getElementById('player-play');
    const prevBtn = document.getElementById('player-prev');
    const nextBtn = document.getElementById('player-next');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSong);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSong);
    }

    // Letter Flip
    const letter = document.querySelector('.letter');
    if (letter) {
        letter.addEventListener('click', function() {
            this.classList.toggle('flipped');
            console.log('Letter clicked, toggling flipped class');
        });
    }

    // Celebration Button
    const celebrateBtn = document.getElementById('celebrate-btn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', function() {
            launchCelebration();
        });
    }

    // Wish Cards
    const wishCards = document.querySelectorAll('.wish-card');
    if (wishCards.length) {
        wishCards.forEach(card => {
            card.addEventListener('click', function() {
                wishCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Launch Celebration
function launchCelebration() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 250);

    // Play celebration sound
    const celebrationSound = new Howl({
        src: ['assets/music/celebration.mp3'],
        volume: 0.7
    });
    celebrationSound.play();
}

// Preload Images
function preloadImages() {
    const imageUrls = [
        'assets/images/dream1.jpg',
        'assets/images/dream2.jpg',
        'assets/images/dream3.jpg',
        'assets/images/dream4.jpg',
        'assets/images/dream5.jpg',
        'assets/images/dream6.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preloadImages on window load
window.addEventListener('load', preloadImages);
