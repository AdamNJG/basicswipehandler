import { VerticalPayload } from './verticalPayload';
import { HorizontalPayload } from './horizontalPayload';

export type TouchHandlerOptions = {
  swipeRight?: () => void;
  swipeLeft?: () => void;
  swipeUp?: () => void;
  swipeDown?: () => void;
  horizontalMove?: (payload: HorizontalPayload) => void;
  verticalMove?: (payload: VerticalPayload) => void;
  moveFinished?: () => void;
  minimumSwipeThreshold?: number;
  maximumMoveThreshold?: number;
  minimumMoveThreshold?: number;
};