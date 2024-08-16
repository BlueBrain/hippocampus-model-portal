export class RendererCtrl {
  public stopped = false;

  private countinuousRenderCounter = 0;
  private once = true;
  private stopTime = null;

  public get render() {
    if (this.stopped) return false;

    if (this.countinuousRenderCounter) return true;

    if (this.stopTime) {
      const now = Date.now();
      if (this.stopTime > now) return true;

      this.stopTime = null;
      return false;
    }

    const { once } = this;
    this.once = false;
    return once;
  }

  public renderOnce() {
    this.once = true;
  }

  public renderFor(time) {
    const now = Date.now();
    if (this.stopTime && this.stopTime > now + time) return;
    this.stopTime = now + time;
  }

  public renderUntilStopped() {
    this.countinuousRenderCounter += 1;
    return () => { this.countinuousRenderCounter -= 1; };
  }

  public stop() {
    this.stopped = true
  }
}
