import { useEffect, useRef, useState } from 'react';

export default function VideoHero() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hasPlayed = false;

        const attemptPlay = async () => {
            if (hasPlayed) return;
            
            try {
                video.muted = true;
                video.playsInline = true;
                await video.play();
                hasPlayed = true;
                setIsPlaying(true);
                console.log('Video playing');
            } catch (error) {
                console.log('Autoplay failed, waiting for user interaction:', error);
            }
        };

        // Try to play when video is ready
        const onCanPlay = () => attemptPlay();
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('loadedmetadata', onCanPlay);

        // If autoplay fails, play on first user interaction
        const playOnInteraction = () => {
            if (!hasPlayed) {
                attemptPlay();
            }
        };

        const events = ['touchstart', 'click', 'scroll'];
        events.forEach(event => {
            document.addEventListener(event, playOnInteraction, { once: true, passive: true });
        });

        // Use Intersection Observer to play when visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && video.paused && !hasPlayed) {
                        attemptPlay();
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(video);

        // Try to play immediately if video is ready
        if (video.readyState >= 3) {
            attemptPlay();
        }

        return () => {
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('loadedmetadata', onCanPlay);
            observer.disconnect();
        };
    }, []);

    return (
        <section className="video-hero" id="home">
            <video
                ref={videoRef}
                src="/hero_video_new.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="video-hero__video"
                webkit-playsinline="true"
                x5-playsinline="true"
            />
            {/* Optional tint to help any navbar overlays or content pop if you add text here later */}
            <div className="video-hero__overlay" />

            <div className="video-hero__content">
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                }}>
                    <img
                        src="/manassanthi_logo_white.svg"
                        alt="Manassanthi"
                        className="reveal-text"
                        style={{
                            height: 'clamp(60px, 10vw, 100px)',
                            width: 'auto',
                            margin: '0',
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                        <div
                            className="reveal-text reveal-text--delay"
                            style={{
                                fontSize: 'clamp(14px, 2.5vw, 20px)',
                                fontWeight: 400,
                                letterSpacing: '0.02em',
                                marginTop: '0px',
                                opacity: 0
                            }}
                        >
                            We Nurture Minds.
                        </div>
                        <div
                            className="reveal-text reveal-text--delay"
                            style={{
                                fontSize: 'clamp(14px, 2.5vw, 20px)',
                                fontWeight: 400,
                                letterSpacing: '0.02em',
                                marginTop: '0px',
                                opacity: 0,
                                animationDelay: '1.5s'
                            }}
                        >
                            We Restore Lives.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
