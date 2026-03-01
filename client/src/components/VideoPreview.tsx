import React, { useEffect, useRef, useState } from "react";
import "./VideoPreview.css";

type Language = "PT" | "ES";

interface VideoContent {
  hook: string;
  pillars: string;
  free: string;
  cta: string;
  ctaUrl: string;
  logo: string;
  tagline: string;
  playHint: string;
}

const CONTENT: Record<Language, VideoContent> = {
  PT: {
    hook: "Sua vida tem um padrão oculto...",
    pillars: "OS 4 PILARES DO DESTINO",
    free: "Descubra GRÁTIS em 30 segundos",
    cta: "COMEÇAR AGORA",
    ctaUrl: "pilaresdasabedoria.club",
    logo: "FUSION-SAJO",
    tagline: "SABEDORIA ANCESTRAL COREANA",
    playHint: "Toque para iniciar",
  },
  ES: {
    hook: "Tu vida tiene un patrón oculto...",
    pillars: "LOS 4 PILARES DEL DESTINO",
    free: "Descúbrelo GRATIS en 30 segundos",
    cta: "COMENZAR AHORA",
    ctaUrl: "pilaresdasabedoria.club",
    logo: "FUSION-SAJO",
    tagline: "SABIDURÍA ANCESTRAL COREANA",
    playHint: "Toca para iniciar",
  },
};

const DURATION = 9000; // 9 seconds

export function VideoPreview({ language = "PT" }: { language?: Language }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ playing: false, raf: 0 });
  const [timer, setTimer] = useState("0.0s");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const content = CONTENT[language];

  // Initialize stars
  useEffect(() => {
    const starsContainer = canvasRef.current?.querySelector(
      `[data-stars="${language}"]`
    );
    if (!starsContainer || starsContainer.children.length > 0) return;

    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 1.5 + 0.5;
      star.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        --d:${1.5 + Math.random() * 3}s;
        --delay:${Math.random() * 3}s;
        --min:${0.1 + Math.random() * 0.3};
      `;
      starsContainer.appendChild(star);
    }

    // Initialize particles
    const particlesContainer = canvasRef.current?.querySelector(
      `[data-particles="${language}"]`
    );
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        const size = Math.random() * 3 + 1;
        particle.style.cssText = `
          width:${size}px; height:${size}px;
          left:${Math.random() * 100}%;
          --fd:${3 + Math.random() * 5}s;
          --fdelay:${Math.random() * 5}s;
          --fx:${(Math.random() - 0.5) * 40}px;
          --drift:${(Math.random() - 0.5) * 20}px;
        `;
        particlesContainer.appendChild(particle);
      }
    }
  }, [language]);

  // Play audio
  const playMysticSound = () => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const master = audioContext.createGain();
    master.gain.setValueAtTime(0.0, audioContext.currentTime);
    master.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.3);
    master.gain.setValueAtTime(0.5, audioContext.currentTime + 7);
    master.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 9);
    master.connect(audioContext.destination);

    // Gayageum pluck
    const pluck = (
      freq: number,
      start: number,
      dur: number,
      vol = 0.3
    ) => {
      const osc = audioContext.createOscillator();
      const g = audioContext.createGain();
      const filt = audioContext.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = freq;
      filt.Q.value = 8;
      osc.type = "triangle";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, audioContext.currentTime + start);
      g.gain.linearRampToValueAtTime(vol, audioContext.currentTime + start + 0.02);
      g.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + start + dur
      );
      osc.connect(filt);
      filt.connect(g);
      g.connect(master);
      osc.start(audioContext.currentTime + start);
      osc.stop(audioContext.currentTime + start + dur + 0.1);
    };

    const scale = [220, 277.18, 329.63, 369.99, 440, 554.37, 659.25];
    pluck(scale[4], 0.0, 3.5, 0.25);
    pluck(scale[2], 0.4, 2.5, 0.18);
    pluck(scale[0], 0.8, 2.0, 0.15);
    pluck(scale[3], 1.2, 2.5, 0.2);
    pluck(scale[5], 2.0, 3.0, 0.22);
    pluck(scale[4], 2.5, 2.0, 0.18);
    pluck(scale[6], 3.0, 3.5, 0.2);
    pluck(scale[5], 3.8, 2.5, 0.22);
    pluck(scale[4], 4.5, 2.0, 0.2);
    pluck(scale[3], 5.0, 1.5, 0.18);

    // Daegeum flute
    const flute = (
      freq: number,
      start: number,
      dur: number,
      vol = 0.1
    ) => {
      const osc = audioContext.createOscillator();
      const noise = audioContext.createOscillator();
      const g = audioContext.createGain();
      const filt = audioContext.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = freq * 4;
      osc.type = "sine";
      osc.frequency.value = freq;
      noise.type = "sawtooth";
      noise.frequency.value = freq * 1.005;
      const ng = audioContext.createGain();
      ng.gain.value = 0.05;
      g.gain.setValueAtTime(0, audioContext.currentTime + start);
      g.gain.linearRampToValueAtTime(vol, audioContext.currentTime + start + 0.4);
      g.gain.setValueAtTime(vol, audioContext.currentTime + start + dur - 0.5);
      g.gain.linearRampToValueAtTime(0, audioContext.currentTime + start + dur);
      osc.connect(filt);
      noise.connect(ng);
      ng.connect(filt);
      filt.connect(g);
      g.connect(master);
      osc.start(audioContext.currentTime + start);
      osc.stop(audioContext.currentTime + start + dur);
      noise.start(audioContext.currentTime + start);
      noise.stop(audioContext.currentTime + start + dur);
    };

    flute(329.63, 1.5, 3.0, 0.12);
    flute(440, 3.0, 3.5, 0.1);
    flute(554.37, 5.0, 3.0, 0.09);

    // Taiko drum
    const taiko = (start: number, freq = 80, vol = 0.4) => {
      const buf = audioContext.createBuffer(
        1,
        audioContext.sampleRate * 0.5,
        audioContext.sampleRate
      );
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.08));
      }
      const src = audioContext.createBufferSource();
      src.buffer = buf;
      const osc = audioContext.createOscillator();
      const og = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioContext.currentTime + start);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 0.4,
        audioContext.currentTime + start + 0.15
      );
      og.gain.setValueAtTime(vol, audioContext.currentTime + start);
      og.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + 0.5);
      const ng = audioContext.createGain();
      ng.gain.value = vol * 0.3;
      osc.connect(og);
      src.connect(ng);
      og.connect(master);
      ng.connect(master);
      osc.start(audioContext.currentTime + start);
      osc.stop(audioContext.currentTime + start + 0.6);
      src.start(audioContext.currentTime + start);
    };

    taiko(2.8, 80, 0.35);
    taiko(4.2, 70, 0.3);
    taiko(5.8, 75, 0.25);

    // Epic hit
    const epicHit = (start: number) => {
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const g = audioContext.createGain();
      const filt = audioContext.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = 600;
      osc1.type = "sawtooth";
      osc1.frequency.value = 110;
      osc2.type = "square";
      osc2.frequency.value = 55;
      g.gain.setValueAtTime(0.6, audioContext.currentTime + start);
      g.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + 1.5);
      osc1.connect(filt);
      osc2.connect(filt);
      filt.connect(g);
      g.connect(master);
      osc1.start(audioContext.currentTime + start);
      osc1.stop(audioContext.currentTime + start + 2);
      osc2.start(audioContext.currentTime + start);
      osc2.stop(audioContext.currentTime + start + 2);

      for (let i = 0; i < 8; i++) {
        const sh = audioContext.createOscillator();
        const sg = audioContext.createGain();
        sh.type = "sine";
        sh.frequency.value = scale[i % scale.length];
        sg.gain.setValueAtTime(0.06, audioContext.currentTime + start + 0.1 * i);
        sg.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + start + 0.1 * i + 1.5
        );
        sh.connect(sg);
        sg.connect(master);
        sh.start(audioContext.currentTime + start + 0.05 * i);
        sh.stop(audioContext.currentTime + start + 0.05 * i + 2);
      }
    };
    epicHit(6.0);
  };

  // Animation runner
  const runAnimation = (startTime: number) => {
    const elapsed = () => Date.now() - startTime;
    const cues: [number, () => void][] = [
      [0, () => {}],
      [500, () => {}],
      [2000, () => {}],
      [2200, () => {}],
      [4500, () => {}],
      [4800, () => {}],
      [5100, () => {}],
      [5500, () => {}],
      [5800, () => {}],
      [7500, () => {}],
      [7800, () => {}],
      [8800, () => {}],
    ];

    let cueIndex = 0;
    const tick = () => {
      if (!stateRef.current.playing) return;
      const e = elapsed();

      while (cueIndex < cues.length && e >= (cues[cueIndex][0] as number)) {
        cueIndex++;
      }

      const pct = Math.min(100, (e / DURATION) * 100);
      setProgress(pct);
      setTimer((e / 1000).toFixed(1) + "s");

      if (e >= DURATION) {
        stop();
        return;
      }

      stateRef.current.raf = requestAnimationFrame(tick);
    };

    tick();
  };

  const stop = () => {
    stateRef.current.playing = false;
    if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf);
    setIsPlaying(false);
    setProgress(0);
    setTimer("0.0s");
  };

  const togglePlay = () => {
    if (stateRef.current.playing) {
      stop();
      return;
    }

    stateRef.current.playing = true;
    setIsPlaying(true);
    playMysticSound();
    runAnimation(Date.now());
  };

  return (
    <div className="video-wrapper">
      <div className="lang-label">
        {language === "PT" ? "🇧🇷 Português" : "🇪🇸 Español"}
      </div>
      <div className="phone-frame">
        <div className="video-canvas" ref={canvasRef} onClick={togglePlay}>
          <div className="bg-stars"></div>
          <div className="nebula" data-nebula={language}></div>
          <div className="gold-light" data-gold-light={language}></div>
          <div className="stars-layer" data-stars={language}></div>
          <div className="particles" data-particles={language}></div>
          <div className="face-scene" data-face-scene={language}></div>

          <svg className="constellation-svg" viewBox="0 0 280 497">
            <line x1="140" y1="170" x2="220" y2="248" stroke="rgba(200,168,75,0.3)" strokeWidth="0.5" />
            <line x1="220" y1="248" x2="140" y2="326" stroke="rgba(200,168,75,0.3)" strokeWidth="0.5" />
            <line x1="140" y1="326" x2="60" y2="248" stroke="rgba(200,168,75,0.3)" strokeWidth="0.5" />
            <line x1="60" y1="248" x2="140" y2="170" stroke="rgba(200,168,75,0.3)" strokeWidth="0.5" />
            <circle cx="140" cy="170" r="2" fill="#c8a84b" opacity="0.7" />
            <circle cx="220" cy="248" r="2" fill="#c8a84b" opacity="0.7" />
            <circle cx="140" cy="326" r="2" fill="#c8a84b" opacity="0.7" />
            <circle cx="60" cy="248" r="2" fill="#c8a84b" opacity="0.7" />
          </svg>

          <div className="symbols-ring" data-symbols={language}>
            <div className="symbol-center">四柱</div>
            <div className="pillar-dot pd-top"></div>
            <div className="pillar-dot pd-right"></div>
            <div className="pillar-dot pd-bottom"></div>
            <div className="pillar-dot pd-left"></div>
          </div>

          <div className="phone-scene" data-phone-scene={language}>
            <div className="phone-glow"></div>
          </div>

          <div className="gold-flash" data-flash={language}></div>

          <div className="text-overlay text-hook">{content.hook}</div>
          <div className="text-overlay text-pillars">
            <span className="kanji">四柱</span>
            <span className="subtitle">{content.pillars}</span>
            <span className="areas">
              {language === "PT"
                ? "Amor • Carreira • Saúde • Prosperidade"
                : "Amor • Carrera • Salud • Prosperidad"}
            </span>
          </div>
          <div className="text-overlay text-free">{content.free}</div>
          <div className="text-overlay text-cta">
            <span className="cta-btn">{content.cta}</span>
            <span className="cta-url">{content.ctaUrl}</span>
          </div>

          <div className="logo-end" data-logo={language}>
            <span className="fusion">{content.logo}</span>
            <span className="tagline">{content.tagline}</span>
          </div>

          <div className="vignette"></div>
          <div className="scanlines"></div>

          <div className="play-hint" data-hint={language}>
            <div className="play-icon"></div>
            <span>{content.playHint}</span>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="controls">
        <button className="btn-play" onClick={togglePlay}>
          {isPlaying ? "⏹ Stop" : "▶ Play"}
        </button>
        <div className="timer-display">{timer}</div>
      </div>
    </div>
  );
}
