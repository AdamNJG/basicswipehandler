import { JSDOM } from 'jsdom';

export const mockTouchEvent = (changedTouches: Array<Touch>) : TouchEvent => {
  return new TouchEvent('touchstart', { changedTouches: changedTouches });
};

export const multipleEvents = () => {
  return [
    mockTouchEvent([createTouch({ clientX: 12, clientY: 4 })]), // 1
    mockTouchEvent([createTouch({ clientX: 6, clientY: 12 })]), // 1
    mockTouchEvent([createTouch({ clientX: 12, clientY: 41 })]), // 1
    mockTouchEvent([createTouch({ clientX: 42, clientY: 4 })]), // 0
    mockTouchEvent([createTouch({ clientX: 30, clientY: 30 })]), // 2
    mockTouchEvent([createTouch({ clientX: 20, clientY: 20 })]) // 2
  ];
};

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

export const createTouch = (payload : { clientX: number, clientY: number }) => {
  return {
    identifier: 1, 
    target: window.document.body,
    screenX: 100, 
    screenY: 200, 
    clientX: payload.clientX, 
    clientY: payload.clientY,
    pageX: 50, 
    pageY: 100,
    force: 0,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0
  };
};