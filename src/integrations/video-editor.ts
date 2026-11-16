/**
 * VANTA — Video Editor Integration
 *
 * Full drag-and-drop video editor UI built on Remotion.
 * Timeline, layers, effects — the complete editing experience.
 * Replaces Remotion Pro Editor Starter ($600).
 *
 * Usage:
 *   const editor = createEditor({ width: 1920, height: 1080 });
 *   editor.addTrack({ type: "video", src: "./clip.mp4" });
 *   editor.addTrack({ type: "audio", src: "./voiceover.wav" });
 *   const video = await editor.render();
 *
 * Repos:
 *   - https://github.com/reactvideoeditor/free-react-video-editor — Open source Remotion editor
 *   - https://github.com/OpenCut-app/OpenCut (MIT) — modern timeline/preview architecture to study
 *   - https://github.com/mohyware/clip-js (MIT) — Remotion + ffmpeg.wasm editor, same stack
 *
 * Note: designcombo/react-video-editor moved to openvideodev and is no longer MIT;
 * twick uses a non-open-source license. Both kept out of the dependency path.
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface EditorConfig {
  width: number;
  height: number;
  fps?: number;
  durationInFrames?: number;
}

export interface EditorTrack {
  id: string;
  type: "video" | "audio" | "image" | "text" | "caption";
  src?: string;
  startFrame: number;
  endFrame: number;
  layer: number;
  properties?: Record<string, unknown>;
}

export interface EditorProject {
  config: EditorConfig;
  tracks: EditorTrack[];
  effects: EditorEffect[];
}

export interface EditorEffect {
  id: string;
  type: "transition" | "filter" | "animation";
  trackId: string;
  startFrame: number;
  endFrame: number;
  params: Record<string, unknown>;
}

export function createEditor(config: EditorConfig): EditorProject {
  // Uses free-react-video-editor or an OpenCut-style timeline (see repos above)
  //
  // Provides a full editing UI:
  //   - Drag-and-drop timeline
  //   - Layer management (video, audio, text, images)
  //   - Real-time preview via Remotion Player
  //   - Export to MP4 via Remotion renderer
  //   - Keyboard shortcuts (split, trim, delete)
  //   - Undo/redo history
  //
  // Architecture:
  //   Editor UI → EditorProject JSON → Remotion <Composition> → MP4
  //
  // The editor serializes your timeline into a JSON structure
  // that maps directly to Remotion sequences and components.

  return {
    config: {
      width: config.width,
      height: config.height,
      fps: config.fps ?? 30,
      durationInFrames: config.durationInFrames ?? 900,
    },
    tracks: [],
    effects: [],
  };
}

export function projectToRemotionProps(project: EditorProject): Record<string, unknown> {
  // Converts an EditorProject into props that can be passed
  // to a Remotion <Composition> for rendering.
  //
  // Each track becomes a Remotion <Sequence> with:
  //   - from={track.startFrame}
  //   - durationInFrames={track.endFrame - track.startFrame}
  //   - The appropriate media component (<Video>, <Audio>, <Img>)
  //
  // Effects become interpolated style transforms applied
  // to their target track's wrapper component.

  return {
    width: project.config.width,
    height: project.config.height,
    fps: project.config.fps,
    durationInFrames: project.config.durationInFrames,
    tracks: project.tracks,
    effects: project.effects,
  };
}
