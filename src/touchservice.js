class TouchService {
  #swipeRight;
  #swipeLeft;
  #swipeUp;
  #swipeDown;
  #minimumDistance;
  #swipeStart;
  #horizontalMove;
  #verticalMove;
  #maximumMoveThreshold;
  #minimumMoveThreshold;

  constructor ({ swipeRight, swipeLeft, swipeUp, swipeDown, minimumSwipeThreshold, horizontalMove, verticalMove, maximumMoveThreshold, minimumMoveThreshold }){
    this.#swipeStart = {};
    this.#swipeRight = swipeRight?? null;
    this.#swipeLeft = swipeLeft ?? null;
    this.#swipeUp = swipeUp ?? null;
    this.#swipeDown = swipeDown ?? null;
    this.#minimumDistance = minimumSwipeThreshold ?? 0;
    this.#horizontalMove = horizontalMove ?? null;
    this.#verticalMove = verticalMove ?? null;
    this.#maximumMoveThreshold = maximumMoveThreshold ?? 0;
    this.#minimumMoveThreshold = minimumMoveThreshold ?? 0;
  }

  startSwipe (touchEvent) {
    if(!this.#checkChangedTouches(touchEvent)){
      return;
    }
    
    this.#swipeStart = { x: touchEvent.changedTouches[0].clientX ?? 0 , y: touchEvent.changedTouches[0].clientY ?? 0 };
  }

  endSwipe (touchEvent) {
    if(!this.#checkChangedTouches(touchEvent)) return;

    let distance = this.#getDistance(touchEvent);
    if(this.#xBiggerDistance(distance) && this.#checkSwipeDistance(distance.x)){
      if (distance.x > 0 && this.#swipeRight != null) this.#swipeRight(); 
      if (distance.x < 0 && this.#swipeLeft != null) this.#swipeLeft();
    } else if(this.#checkSwipeDistance(distance.y)){
      if (distance.y < 0 && this.#swipeUp != null) this.#swipeUp(); 
      if (distance.y > 0 && this.#swipeDown != null) this.#swipeDown();
    }
  }

  touchMove (touchEvent){
    if(!this.#checkChangedTouches(touchEvent)) return;

    let distance = this.#getDistance(touchEvent);

    if (this.#checkMoveDistance(distance.x)){
      if (this.#horizontalMove != null)this.#horizontalMove({ x: this.#getClientXFromEvent(touchEvent), startX: this.#swipeStart.x, distance: distance.x });
    }
    if (this.#checkMoveDistance(distance.y)){
      if (this.#verticalMove != null)this.#verticalMove({ y: this.#getClientYFromEvent(touchEvent), startY: this.#swipeStart.y, distance: distance.y });
    }
  }

  #getDistance (touchEvent) {
    return { x: this.#getClientXFromEvent(touchEvent) - this.#swipeStart.x , y: this.#getClientYFromEvent(touchEvent) - this.#swipeStart.y };
  }

  #checkSwipeDistance (distance) {
    return this.#invertNegative(distance) - this.#minimumDistance > 0; 
  }

  #checkMoveDistance (distance) {
    return (this.#minimumMoveThreshold === 0 || this.#invertNegative(distance) - this.#minimumMoveThreshold >= 0) 
    && (this.#maximumMoveThreshold === 0 || this.#invertNegative(distance) - this.#maximumMoveThreshold <= 0);
  }

  #invertNegative (input) {
    return Math.abs(input); 
  } 

  #checkChangedTouches (touchEvent) {
    return touchEvent.changedTouches.length === 1 ? true : false;
  }

  #getClientXFromEvent (event){
    return event.changedTouches[0].clientX ?? 0;
  }

  #getClientYFromEvent (event){
    return event.changedTouches[0].clientY ?? 0;
  }

  #xBiggerDistance (distance) {
    return this.#invertNegative(distance.x) > this.#invertNegative(distance.y);
  }
}

TouchService.Axis = {
  X: 'x',
  Y: 'y'
};

export default TouchService;