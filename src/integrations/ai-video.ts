/**
 * VANTA — AI Video Generation Integration
 *
 * Text-to-video and image-to-video generation using open-source models.
 * Generate B-roll, backgrounds, and scene footage from text prompts.
 *
 * Usage:
 *   const clip = await generateVideo("A sunset over the ocean, cinematic");
 *   // Use clip.url in Remotion's <OffthreadVideo> component
 *
 * Repos:
 *   - https://github.com/Wan-Video/Wan2.2 (Apache-2.0 code + weights) — T2V / I2V, TI2V-5B fits one 4090
 *   - https://github.com/Lightricks/LTX-Video — real-time-class generation (check weights license)
 *   - https://github.com/lllyasviel/FramePack (Apache-2.0) — long image → video on 6GB VRAM
 *   - https://github.com/hpcaitech/Open-Sora — legacy fallback
 *
 * Replaced (outdated): AnimateDiff, Tune-A-Video, Allegro (unmaintained).
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface VideoGenerationConfig {
  serverUrl: string;
  model?: "wan2.2" | "ltx-video" | "framepack" | "open-sora";
}

export interface GeneratedClip {
  url: string;
  duration: number;
  width: number;
  height: number;
  prompt: string;
}

export async function generateVideo(
  prompt: string,
  config: VideoGenerationConfig
): Promise<GeneratedClip> {
  const { serverUrl, model = "wan2.2" } = config;

  const response = await fetch(`${serverUrl}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      model,
      duration: 6,
      width: 1280,
      height: 720,
      fps: 24,
    }),
  });

  return response.json();
}

export async function animateImage(
  imagePath: string,
  motionPrompt: string,
  config: VideoGenerationConfig
): Promise<GeneratedClip> {
  const { serverUrl, model = "framepack" } = config;

  const response = await fetch(`${serverUrl}/animate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imagePath, prompt: motionPrompt, model }),
  });

  return response.json();
}
