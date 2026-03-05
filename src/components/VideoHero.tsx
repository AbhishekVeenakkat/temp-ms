export default function VideoHero() {
    return (
        <section className="video-hero" id="home">
            <video
                className="video-hero__video"
                src="/hero_video.mp4"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
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
                        We Nurture Minds. We Restore Lives.
                    </div>
                </div>
            </div>
        </section>
    );
}
