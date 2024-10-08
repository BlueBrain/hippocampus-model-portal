import { TgdContext, TgdEvent } from "@tgd";

export class PixelScaleWatcher {
  public readonly eventPixelScaleChange = new TgdEvent<number>();

  /**
   * `pixelScale` depends on the camera height, the zoom and
   * the viewport height.
   * We memorize these values to send the `eventPixelScaleChange` when
   * needed.
   */
  private previousCameraHeight = -1;
  private previousCameraZoom = -1;
  private previousViewportHeight = -1;

  private _context: TgdContext | null = null;

  get context() {
    return this._context;
  }
  set context(context: TgdContext | null) {
    if (this._context) {
      this._context.eventResize.removeListener(this.handleCameraChange);
      this._context.camera.eventTransformChange.removeListener(
        this.handleCameraChange
      );
    }
    this._context = context;
    if (!context) return;

    this.previousCameraHeight = -1;
    context.eventResize.addListener(this.handleCameraChange);
    context.camera.eventTransformChange.addListener(this.handleCameraChange);
    this.handleCameraChange();
  }

  get pixelScale() {
    const { context } = this;
    if (!context) return 1;

    const { camera } = context;
    return camera.spaceHeightAtTarget / (camera.zoom * camera.screenHeight);
  }

  private readonly handleCameraChange = () => {
    const { context } = this;
    if (!context) return;

    const { camera } = context;
    const spaceHeight = camera.spaceHeightAtTarget;
    const cameraZoom = camera.zoom;
    const screenHeight = camera.screenHeight;
    if (
      spaceHeight === this.previousCameraHeight &&
      cameraZoom === this.previousCameraZoom &&
      screenHeight === this.previousViewportHeight
    ) {
      return;
    }

    this.previousCameraHeight = spaceHeight;
    this.previousCameraZoom = cameraZoom;
    this.previousViewportHeight = screenHeight;
    this.eventPixelScaleChange.dispatch(this.pixelScale);
    console.log("🚀 [pixel-scale-watcher] this.pixelScale = ", this.pixelScale); // @FIXME: Remove this line written on 2024-10-08 at 13:38
  };
}
