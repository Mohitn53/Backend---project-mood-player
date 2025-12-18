import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarker = null;

export async function initFaceLandmarker() {
  if (faceLandmarker) return faceLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "/models/face_landmarker.task",
      delegate: "CPU",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  console.log("✅ MediaPipe FaceLandmarker ready");
  return faceLandmarker;
}
