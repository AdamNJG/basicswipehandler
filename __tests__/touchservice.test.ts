import { describe, expect, test } from 'vitest';
import TouchHandler from '../src/touchService';
import { mockTouchEvent, createTouch, multipleEvents } from './helpers/touchServiceTestHelper';

/**
 *  @vitest-environment jsdom
 */

describe('A service that handles drag events', () => {

  test('positiveXEvent_startAndEndSwipe_correctOutputs', () => {
    let value = 0;
    function xPositive () {
      value = 10;
    }
    function xNegative () {
      value = -10;
    }

    const touchService = new TouchHandler({
      swipeRight: xPositive,
      swipeLeft: xNegative
    });
 
    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 10,  clientY: 0 })]));

    expect(value).toBe(10);
  });

  test('positiveYEvent_startAndEndSwipe_correctOutputs', () => {
    let value = 0;
    function positive () {
      value = 10;
    }
    function negative () {
      value = -10;
    }
    const touchService = new TouchHandler({
      swipeUp: positive,
      swipeDown: negative
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientY: 10, clientX: 0 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientY: 2, clientX: 0 })]));

    expect(value).toBe(10);
  });

  test('negativeXEvent_startAndEndSwipe_correctOutputs',() => {
    let value = 0;
    function positive () {
      value = 10;
    }
    function negative () {
      value = -10;
    }
    const touchService = new TouchHandler({
      swipeRight: positive,
      swipeLeft: negative
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientY: 0, clientX: 20 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientY: 0, clientX: 10 })]));

    expect(value).toBe(-10);
  });

  test('negativeYEvent_startAndEndSwipe_correctOutputs',() => {
    let value = 0;
    function positive () {
      value = 10;
    }
    function negative () {
      value = -10;
    }
    const touchService = new TouchHandler({
      swipeUp: positive,
      swipeDown: negative
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 10 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 20 })]));

    expect(value).toBe(-10);
  });

  test('initialise_setMinimumDistance_validEventTriggerFunction', () => {
    let value = 0;
    function positive () {
      value = 10;
    }

    const touchService = new TouchHandler({
      swipeRight: positive,
      minimumSwipeThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 10, clientY: 0 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 41, clientY: 0 })]));

    expect(value).toBe(10);
  });

  test('initialise_setMinimumDistance_invalidEventNotTriggerFunction', () => {
    let value = 0;
    function positive () {
      value = 10;
    }

    const touchService = new TouchHandler({
      swipeRight: positive,
      minimumSwipeThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 25, clientY: 0 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY:0 })]));

    expect(value).toBe(0);
  });

  test('XandYEvent_bothAxisValid_onlyExecuteLargestX', () => {
    const value = { x: 0, y:0 };
    function x () {
      value.x = 10;
    }

    function y () {
      value.y = 10;
    }

    const touchService = new TouchHandler({
      swipeRight: x,
      swipeUp: y
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 1, clientY: 0 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 40, clientY: -38 })]));

    expect(value).toStrictEqual({ x: 10, y: 0 });
  });

  test('XandYEvent_bothAxisValid_onlyExecuteLargestY', () => {
    const value = { x: 0, y:0 };
    function x () {
      value.x = 10;
    }

    function y () {
      value.y = 10;
    }

    const touchService = new TouchHandler({
      swipeRight: x,
      swipeUp: y
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 2 })]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 40, clientY: -41 })]));

    expect(value).toStrictEqual({ x: 0, y: 10 });
  });

  test('horizontalMove_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      horizontalMove: touchMove
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 29, clientY: 0 })]));

    expect(value).toStrictEqual({ x: 29, startX: 0, distance: 29 });
  });

  test('verticalMove_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      verticalMove: touchMove
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientY: 0 , clientX: 0 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientY: 29, clientX: 0 })]));

    expect(value).toStrictEqual({ y: 29, startY: 0, distance: 29 });
  });

  test('verticalMove_minimumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      verticalMove: touchMove,
      minimumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 1 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 0, clientY: 30 })]));

    expect(value).toStrictEqual({ y: 30, startY: 1, distance: 29 });
  });

  test('verticalMove_minimumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      verticalMove: touchMove,
      minimumMoveThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 20 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 0, clientY: 49 })]));

    expect(value).toBe(0);
  });

  test('horizontalMove_minimumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      horizontalMove: touchMove,
      minimumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 29, clientY: 0 })]));

    expect(value).toStrictEqual({ x: 29, startX: 0, distance: 29 });
  });

  test('horizontalMove_minimumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      horizontalMove: touchMove,
      minimumMoveThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 29, clientY: 0 })]));

    expect(value).toBe(0);
  });

  test('verticalMove_maximumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      verticalMove: touchMove,
      maximumMoveThreshold: 29
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 2 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 0, clientY: 31 })]));

    expect(value).toStrictEqual({ y: 31, startY: 2, distance: 29 });
  });

  test('verticalMove_maximumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      verticalMove: touchMove,
      maximumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 20 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX:0, clientY: 49 })]));

    expect(value).toBe(0);
  });

  test('horizontalMove_maximumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      horizontalMove: touchMove,
      maximumMoveThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 29, clientY: 0 })]));

    expect(value).toStrictEqual({ x: 29, startX: 0, distance: 29 });
  });

  test('horizontalMove_maximumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      horizontalMove: touchMove,
      maximumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));
    touchService.touchMove(mockTouchEvent([createTouch({ clientX: 29, clientY: 0 })]));

    expect(value).toBe(0);
  });

  test('multipleEvents_minAndMaxMove_validEventCount', () => {
    let count = 0;
    function incrementCount () {
      count++;
    }

    // this will trigger incrementCount to increment each time that an X or Y is within the 
    const touchService = new TouchHandler({
      horizontalMove: incrementCount,
      verticalMove: incrementCount,
      maximumMoveThreshold: 40,
      minimumMoveThreshold: 10
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));

    // the multiple events functiona adds 6 events, one of them doesn't trigger, and 2 triggers twice
    const sixEventsSevenTriggers = multipleEvents();
    sixEventsSevenTriggers.forEach((event) => touchService.touchMove(event));

    expect(count).toBe(7);
  });

  test('endOfMovement_EventTriggered', () => {
    let count = 0;
    let endCount = 0;
    function incrementOnMove () {
      count++;
    }
    function incrementOnEnd () {
      endCount++;
    }

    // this will trigger incrementCount to increment each time that an X or Y is within the 
    const touchService = new TouchHandler({
      moveFinished: incrementOnEnd,
      horizontalMove: incrementOnMove,
      verticalMove: incrementOnMove,
      maximumMoveThreshold: 40,
      minimumMoveThreshold: 10
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));

    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 0 })]));

    expect(count).toBe(0);
    expect(endCount).toBe(1);
  });

  test('startEventNoTouches_startAndEnd_notTriggered', () => {
    let value = 0;
    function xPositive () {
      value = 10;
    }
    function xNegative () {
      value = -10;
    }

    const touchService = new TouchHandler({
      swipeRight: xPositive,
      swipeLeft: xNegative
    });
 
    touchService.startSwipe(mockTouchEvent([]));
    touchService.endSwipe(mockTouchEvent([createTouch({ clientX: 10,  clientY: 0 })]));

    expect(value).toBe(0);
  });

  test('touchMove_eventEmpty_notTriggered', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      verticalMove: touchMove,
      maximumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 20 })]));
    touchService.touchMove(mockTouchEvent([]));

    expect(value).toBe(0);
  });

  test('touchMove_eventEmpty_notTriggered', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    const touchService = new TouchHandler({
      verticalMove: touchMove,
      maximumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([createTouch({ clientX: 0, clientY: 20 })]));
    touchService.touchMove(mockTouchEvent([]));

    expect(value).toBe(0);
  });
});