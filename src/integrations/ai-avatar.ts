/**
 * VANTA — AI Avatar Integration
 *
 * Integrates MuseTalk, LatentSync and InfiniteTalk for turning a single
 * photo (or existing footage) into a talking-head video with lip sync.
 *
 * Usage:
 *   const avatar = await createAvatar("./headshot.jpg");
 *   const videoUrl = await avatar.speak("./voiceover.wav");
 *   // Use videoUrl in Remotion's <OffthreadVideo> component
 *
 * Repos:
 *   - https://github.com/TMElyralab/MuseTalk (MIT) — real-time 30fps+ lip sync / dubbing
 *   - https://github.com/bytedance/LatentSync (Apache-2.0) — diffusion lip sync on existing video
 *   - https://github.com/MeiGen-AI/InfiniteTalk (Apache-2.0) — unlimited-length photo → talking video
 *   - https://github.com/antgroup/echomimic_v3 (Apache-2.0) — expressive half/full-body animation
 *
 * Replaced (outdated): SadTalker, VideoReTalking (unmaintained since 2024),
 * Wav2Lip (non-commercial), V-Express (research-only checkpoints).
 *
 * This replaces Synthesia ($30/video) with unlimited free generation.
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface AvatarConfig {
  serverUrl: string;
  imagePath: string;
  method?: "musetalk" | "latentsync" | "infinitetalk";
  /** Model used by speakWithExpression(). Defaults to "echomimic". */
  expressionMethod?: "echomimic" | "infinitetalk";
}

export interface Avatar {
  speak: (audioPath: string) => Promise<string>; // Returns video URL
  speakWithExpression: (audioPath: string, emotion: string) => Promise<string>;
}

export async function createAvatar(config: AvatarConfig): Promise<Avatar> {
  const { serverUrl, imagePath, method = "musetalk", expressionMethod = "echomimic" } = config;

  return {
    speak: async (audioPath: string) => {
      const response = await fetch(`${serverUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePath, audio: audioPath, method }),
      });
      const { video_url } = await response.json();
      return video_url;
    },
    speakWithExpression: async (audioPath: string, emotion: string) => {
      const response = await fetch(`${serverUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePath, audio: audioPath, method: expressionMethod, emotion }),
      });
      const { video_url } = await response.json();
      return video_url;
    },
  };
}
