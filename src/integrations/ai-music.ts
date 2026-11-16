/**
 * VANTA — AI Music Generation Integration
 *
 * Generate custom soundtracks on demand using open-source models.
 * Free, local, unlimited — no Suno subscription needed.
 *
 * Usage:
 *   const track = await generateMusic("upbeat corporate tech background");
 *   // Use track.url in Remotion's <Audio> component
 *
 * Repos:
 *   - https://github.com/ace-step/ACE-Step-1.5 (MIT) — official REST API: `uv run acestep-api` → localhost:8001
 *   - https://github.com/multimodal-art-projection/YuE (Apache-2.0) — full songs with vocals
 *   - https://github.com/ASLP-lab/DiffRhythm (Apache-2.0) — fast full-length songs
 *
 * Replaced (outdated): ace-step-ui (unlicensed wrapper), AudioGPT (unmaintained since 2024).
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface MusicConfig {
  serverUrl: string;
  model?: "ace-step" | "yue" | "diffrhythm";
}

export interface GeneratedTrack {
  url: string;
  duration: number;
  bpm: number;
  prompt: string;
}

export async function generateMusic(
  prompt: string,
  config: MusicConfig
): Promise<GeneratedTrack> {
  const { serverUrl, model = "ace-step" } = config;

  const response = await fetch(`${serverUrl}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model, duration: 30 }),
  });

  return response.json();
}
