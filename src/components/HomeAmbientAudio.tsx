import { useEffect, useRef } from "react";
import { BRAND } from "@/lib/brand";
import { whenPreloaderReady } from "@/lib/scrollAnimations";

const BG_VOLUME = 0.08;

/** Loops subtle background audio after the preloader finishes. */
const HomeAmbientAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(BRAND.AUDIO_BG);
    audio.volume = BG_VOLUME;
    audio.loop = true;
    audioRef.current = audio;

    const playBgAudio = async () => {
      try {
        await audio.play();
      } catch {
        const unlock = () => {
          audio.play().catch(() => {});
        };
        document.addEventListener("pointerdown", unlock, { once: true, capture: true });
        document.addEventListener("click", unlock, { once: true, capture: true });
      }
    };

    const removeListener = whenPreloaderReady(playBgAudio);

    return () => {
      removeListener();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  return null;
};

export default HomeAmbientAudio;
