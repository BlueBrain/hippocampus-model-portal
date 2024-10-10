import {
  tgdActionCreateCameraInterpolation,
  TgdContext,
  tgdEasingFunctionInOutCubic,
  TgdQuat,
} from "@tgd";

export function interpolateCamera(
  context: TgdContext,
  journey: {
    from: Readonly<TgdQuat>;
    to: Readonly<TgdQuat>;
  }
) {
  const { camera } = context;
  camera.orientation = journey.from;
  context.animSchedule({
    action: tgdActionCreateCameraInterpolation(camera, {
      orientation: journey.to,
    }),
    duration: 500,
    easingFunction: tgdEasingFunctionInOutCubic,
  });
  context.paint();
}
