import { HorizontalPayload } from './types/horizontalPayload';
import { VerticalPayload } from './types/verticalPayload';
import { DistancePayload } from './types/distancePayload';
import { TouchHandlerOptions } from './types/touchHandlerOptions';

class TouchHandler {
  private swipeStart: DistancePayload;
  private swipeRight: (() => void) | null;
  private swipeLeft: (() => void) | null;
  private swipeUp: (() => void) | null;
  private swipeDown: (() => void) | null;
  private horizontalMove: ((payload: HorizontalPayload) => void) | null;
  private verticalMove: ((payload: VerticalPayload) => void) | null;
  private moveFinished: (() => void) | null;
  private minimumSwipeThreshold: number;
  private maximumMoveThreshold: number;
  private minimumMoveThreshold: number;

  public constructor (options: TouchHandlerOptions) {
    this.swipeStart = { x: -1, y: -1 };
    this.swipeRight = options.swipeRight;
    this.swipeLeft = options.swipeLeft;
    this.swipeUp = options.swipeUp;
    this.swipeDown = options.swipeDown;
    this.horizontalMove = options.horizontalMove;
    this.verticalMove = options.verticalMove;
    this.moveFinished = options.moveFinished;
    this.minimumSwipeThreshold = options.minimumSwipeThreshold ?? 0;
    this.maximumMoveThreshold = options.maximumMoveThreshold ?? 0;
    this.minimumMoveThreshold = options.minimumMoveThreshold ?? 0;
  }

  public startSwipe (touchEvent: TouchEvent): void {
    if (!this.checkChangedTouches(touchEvent)) {
      return;
    }
    
    this.swipeStart = { x: touchEvent.changedTouches[0].clientX, y: touchEvent.changedTouches[0].clientY };
  }

  public endSwipe (touchEvent: TouchEvent): void {
    if (!this.checkChangedTouches(touchEvent) || this.swipeStartEmpty()) return;

    const distance = this.getDistance(touchEvent);
    if (this.isXDistanceGreater(distance) && this.checkSwipeDistance(distance.x)) {
      if (distance.x > 0 && this.swipeRight != null) this.swipeRight(); 
      if (distance.x < 0 && this.swipeLeft != null) this.swipeLeft();
    } else if (this.checkSwipeDistance(distance.y)) {
      if (distance.y < 0 && this.swipeUp != null) this.swipeUp(); 
      if (distance.y > 0 && this.swipeDown != null) this.swipeDown();
    }

    if (this.moveFinished) this.moveFinished();
  }

  public touchMove (touchEvent: TouchEvent): void {
    if (!this.checkChangedTouches(touchEvent)) return;

    const distance = this.getDistance(touchEvent);

    if (this.checkMoveDistance(distance.x)) {
      if (this.horizontalMove != null) this.horizontalMove({ x: this.getClientXFromEvent(touchEvent), startX: this.swipeStart.x, distance: distance.x });
    }
    if (this.checkMoveDistance(distance.y)) {
      if (this.verticalMove != null) this.verticalMove({ y: this.getClientYFromEvent(touchEvent), startY: this.swipeStart.y, distance: distance.y });
    }
  }

  private getDistance (touchEvent: TouchEvent): DistancePayload {
    return { x: this.getClientXFromEvent(touchEvent) - this.swipeStart.x , y: this.getClientYFromEvent(touchEvent) - this.swipeStart.y };
  }

  private checkSwipeDistance (distance: number): boolean {
    return Math.abs(distance) - this.minimumSwipeThreshold > 0; 
  }

  private checkMoveDistance (distance: number): boolean {
    return (this.minimumMoveThreshold === 0 || Math.abs(distance) - this.minimumMoveThreshold >= 0) 
    && (this.maximumMoveThreshold === 0 || Math.abs(distance) - this.maximumMoveThreshold <= 0);
  }

  private checkChangedTouches (touchEvent: TouchEvent): boolean {
    return touchEvent.changedTouches.length === 1 ? true : false;
  }

  private getClientXFromEvent (touchEvent: TouchEvent): number {
    return touchEvent.changedTouches[0].clientX;
  }

  private getClientYFromEvent (touchEvent: TouchEvent): number {
    return touchEvent.changedTouches[0].clientY;
  }

  private isXDistanceGreater (distance: DistancePayload): boolean {
    return Math.abs(distance.x) > Math.abs(distance.y);
  }

  private swipeStartEmpty (): boolean {
    return this.swipeStart.x === -1 && this.swipeStart.y === -1;
  }
}

export default TouchHandler;