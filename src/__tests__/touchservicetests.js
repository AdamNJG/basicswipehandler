import { describe, expect, test } from '@jest/globals';
import TouchService from '../touchservice.js';

describe('A service that handles drag events', () => {

  test('positiveXEvent_startAndEndSwipe_correctOutputs', () => {
    let value = 0;
    function xPositive () {
      value = 10;
    }
    function xNegative () {
      value = -10;
    }

    var touchService = new TouchService({
      swipeRight: xPositive,
      swipeLeft: xNegative
    });
 
    touchService.startSwipe(mockTouchEvent([{ clientX: 2 }]));
    touchService.endSwipe(mockTouchEvent([{ clientX: 10 }]));

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
    var touchService = new TouchService({
      swipeUp: positive,
      swipeDown: negative
    });

    touchService.startSwipe(mockTouchEvent([{ clientY: 10 }]));
    touchService.endSwipe(mockTouchEvent([{ clientY: 2 }]));

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
    var touchService = new TouchService({
      swipeRight: positive,
      swipeLeft: negative
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 20 }]));
    touchService.endSwipe(mockTouchEvent([{ clientX: 10 }]));

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
    var touchService = new TouchService({
      swipeUp: positive,
      swipeDown: negative
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: -1, clientY: 10 }]));
    touchService.endSwipe(mockTouchEvent([{ clientY: 20 }]));

    expect(value).toBe(-10);
  });

  test('initialise_setMinimumDistance_validEventTriggerFunction', () => {
    let value = 0;
    function positive () {
      value = 10;
    }

    var touchService = new TouchService({
      swipeRight: positive,
      minimumSwipeThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 10 }]));
    touchService.endSwipe(mockTouchEvent([{ clientX: 41 }]));

    expect(value).toBe(10);
  });

  test('initialise_setMinimumDistance_invalidEventNotTriggerFunction', () => {
    let value = 0;
    function positive () {
      value = 10;
    }

    var touchService = new TouchService({
      swipeRight: positive,
      minimumSwipeThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 25 }]));
    touchService.endSwipe(mockTouchEvent([{ clientX: 0 }]));

    expect(value).toBe(0);
  });

  test('XandYEvent_bothAxisValid_onlyExecuteLargestX', () => {
    let value = { x: 0, y:0 };
    function x (){
      value.x = 10;
    }

    function y (){
      value.y = 10;
    }

    var touchService = new TouchService({
      swipeRight: x,
      swipeUp: y
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0, clientY: 0 }]));
    touchService.endSwipe(mockTouchEvent([{ clientX: 40, clientY: -38 }]));

    expect(value).toStrictEqual({ x: 10, y: 0 });
  });

  test('XandYEvent_bothAxisValid_onlyExecuteLargestY', () => {
    let value = { x: 0, y:0 };
    function x (){
      value.x = 10;
    }

    function y (){
      value.y = 10;
    }

    var touchService = new TouchService({
      swipeRight: x,
      swipeUp: y
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0, clientY: 0 }]));
    touchService.endSwipe(mockTouchEvent([{ clientX: 40, clientY: -41 }]));

    expect(value).toStrictEqual({ x: 0, y: 10 });
  });

  test('horizontalMove_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      horizontalMove: touchMove
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0 }]));
    touchService.touchMove(mockTouchEvent([{ clientX: 29 }]));

    expect(value).toStrictEqual({ x: 29, startX: 0, distance: 29 });
  });

  test('verticalMove_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      verticalMove: touchMove
    });

    touchService.startSwipe(mockTouchEvent([{ clientY: 0 }]));
    touchService.touchMove(mockTouchEvent([{ clientY: 29 }]));

    expect(value).toStrictEqual({ y: 29, startY: 0, distance: 29 });
  });

  test('verticalMove_minimumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      verticalMove: touchMove,
      minimumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([{ clientY: 1 }]));
    touchService.touchMove(mockTouchEvent([{ clientY: 30 }]));

    expect(value).toStrictEqual({ y: 30, startY: 1, distance: 29 });
  });

  test('verticalMove_minimumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      verticalMove: touchMove,
      minimumMoveThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([{ clientY: 20 }]));
    touchService.touchMove(mockTouchEvent([{ clientY: 49 }]));

    expect(value).toBe(0);
  });

  test('horizontalMove_minimumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      horizontalMove: touchMove,
      minimumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0 }]));
    touchService.touchMove(mockTouchEvent([{ clientX: 29 }]));

    expect(value).toStrictEqual({ x: 29, startX: 0, distance: 29 });
  });

  test('horizontalMove_minimumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      horizontalMove: touchMove,
      minimumMoveThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0 }]));
    touchService.touchMove(mockTouchEvent([{ clientX: 29 }]));

    expect(value).toBe(0);
  });

  test('verticalMove_maximumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      verticalMove: touchMove,
      maximumMoveThreshold: 29
    });

    touchService.startSwipe(mockTouchEvent([{ clientY: 2 }]));
    touchService.touchMove(mockTouchEvent([{ clientY: 31 }]));

    expect(value).toStrictEqual({ y: 31, startY: 2, distance: 29 });
  });

  test('verticalMove_maximumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      verticalMove: touchMove,
      maximumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([{ clientY: 20 }]));
    touchService.touchMove(mockTouchEvent([{ clientY: 49 }]));

    expect(value).toBe(0);
  });

  test('horizontalMove_maximumTouchMoveThreshold_valueUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      horizontalMove: touchMove,
      maximumMoveThreshold: 30
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0 }]));
    touchService.touchMove(mockTouchEvent([{ clientX: 29 }]));

    expect(value).toStrictEqual({ x: 29, startX: 0, distance: 29 });
  });

  test('horizontalMove_maximumTouchMoveThreshold_valueNotUpdatedByTouchMove', () => {
    let value = 0;
    function touchMove (input) {
      value = input;
    }

    var touchService = new TouchService({
      horizontalMove: touchMove,
      maximumMoveThreshold: 20
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0 }]));
    touchService.touchMove(mockTouchEvent([{ clientX: 29 }]));

    expect(value).toBe(0);
  });

  test('multipleEvents_minAndMaxMove_validEventCount', () => {
    let count = 0;
    function incrementCount () {
      count++;
    }

    // this will trigger incrementCount to increment each time that an X or Y is within the 
    var touchService = new TouchService({
      horizontalMove: incrementCount,
      verticalMove: incrementCount,
      maximumMoveThreshold: 40,
      minimumMoveThreshold: 10
    });

    touchService.startSwipe(mockTouchEvent([{ clientX: 0, clientY: 0 }]));

    multipleEvents().forEach((event) => touchService.touchMove(event));

    expect(count).toBe(7);
  });

});

const mockTouchEvent = (changedTouches) => {
  return {
    changedTouches: changedTouches
  };
};

const multipleEvents = () => {
  return [
    mockTouchEvent([{ clientX: 12, clientY: 4 }]), // 1
    mockTouchEvent([{ clientX: 6, clientY: 12 }]), // 1
    mockTouchEvent([{ clientX: 12, clientY: 41 }]), // 1
    mockTouchEvent([{ clientX: 42, clientY: 4 }]), // 0
    mockTouchEvent([{ clientX: 30, clientY: 30 }]), // 2
    mockTouchEvent([{ clientX: 20, clientY: 20 }]) // 2
  ];
};