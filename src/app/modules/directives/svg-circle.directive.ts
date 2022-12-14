/**
 * Import Angular libraries.
 */
import { Directive, Input, Output, EventEmitter, OnDestroy, AfterViewChecked, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

/**
 * Import third-party libraries.
 */
import { Circle } from '@svgdotjs/svg.js';

/**
 * Import custom components.
 */
import { SvgContainerComponent } from '../components/svg-container/svg-container.component';

@Directive({
  selector: 'svg-circle'
})
export class SvgCircleDirective implements AfterViewChecked, OnChanges, OnDestroy {
  /**
   * Globally used variables within the directive.
   */
  private _circle!: Circle;

  /**
   * Import variables for the circle directive.
   */
  @Input() diameter!: number; // Diameter of the circle
  @Input() color = '#000'; // Color of the circle background
  @Input() x = 0; // Starting point on x axis.
  @Input() y = 0; // Starting point on y axis.
  @Input() classes: string[] = []; // List of CSS classes which needs to be added.

  /**
   * Output variables for the circle directive.
   */
  @Output() clickEvent: EventEmitter<Event> = new EventEmitter();
  @Output() doubleClickEvent: EventEmitter<Event> = new EventEmitter();
  @Output() mouseOverEvent: EventEmitter<Event> = new EventEmitter();
  @Output() mouseOutEvent: EventEmitter<Event> = new EventEmitter();
  @Output() mouseDownEvent: EventEmitter<Event> = new EventEmitter();
  @Output() mouseUpEvent: EventEmitter<Event> = new EventEmitter();
  @Output() onInitialize: EventEmitter<Circle> = new EventEmitter();

  /**
   * Create SVG Circle directive.
   * @param _svgContainer - Host SVG Container Component object instance.
   * @param _elRef - Angular element reference object instance.
   */
  constructor(
    private _svgContainer: SvgContainerComponent,
    private _elRef: ElementRef
  ) { }

  /**
   * Creates the circle object within the container.
   */
  ngAfterViewChecked(): void {
    // Check if container is created and no circle object is created
    if (this._svgContainer.getContainer() && !this._circle) {
      // If so, let's create a circle
      this.createCircle();
    }
  }

  /**
   * Does all required pre-requisites before destroying the component.
   */
  ngOnDestroy(): void {
    this._circle.remove();
  }

  /**
   * Is called when changes are made to the circle object.
   * @param changes - Angular Simple Changes object containing all of the changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this._circle) {
      // If we have already created the object, update it.
      this.updateCircle();

      // Check if classes were changed
      if (changes["classes"] && changes["classes"].currentValue !== changes["classes"].previousValue) {
        // Get classes that needs to be removed
        const classesToRemove = changes['classes'].previousValue.filter((previousClass: string) =>
          !changes['classes'].currentValue.some((currentClass: string) => currentClass === previousClass)
        );

        // Get classes that needs to be added
        const classesToAdd = changes['classes'].currentValue.filter((currentClass: string) =>
          !changes['classes'].previousValue.some((previousClass: string) => currentClass === previousClass)
        );

        // Add and remove classes
        this.addRemoveClasses(classesToAdd, classesToRemove);
      }
    }
  }

  /**
   * Update circle object within the SVG container.
   */
  private updateCircle(): void {
    this._circle
      .size(this.diameter) // Set the diameter (twice the radius)
      .fill(this.color) // Set the fill color
      .attr('cx', +this.x + +this.diameter / 2) // Set x position
      .attr('cy', +this.y + +this.diameter / 2); // Set y position

    // Let's set element in a correct position
    this.setCorrectPosition();
  }

  /**
   * Create circle object within the SVG container.
   */
  private createCircle(): void {
    this._circle = this._svgContainer.getContainer()
      .circle(this.diameter) // Create the circle with diameter (twice the radius)
      .fill(this.color) // Set the fill color
      .attr('cx', +this.x + +this.diameter / 2) // Set x position
      .attr('cy', +this.y + +this.diameter / 2) // Set y position
      .on('click', (evt: Event) => this.clickEvent.emit(evt)) // Assign click event
      .on('dblclick', (evt: Event) => this.doubleClickEvent.emit(evt)) // Assign double click event
      .on('mouseover', (evt: Event) => this.mouseOverEvent.emit(evt)) // Assign mouse over event
      .on('mouseout', (evt: Event) => this.mouseOutEvent.emit(evt)) // Assign mouse out event
      .on('mousedown', (evt: Event) => this.mouseDownEvent.emit(evt)) // Assign mouse down event
      .on('mouseup', (evt: Event) => this.mouseUpEvent.emit(evt)); // Assign mouse up event

    // Let's set element in a correct position
    this.setCorrectPosition();

    // Add classes to the circle
    this.addRemoveClasses(this.classes);

    // Let's output the circle element
    this.onInitialize.emit(this._circle);
  }

  /**
   * Sets correct position for the element.
   */
  private setCorrectPosition() {
    // Find position of an element within the parent container
    const position = Array.prototype.slice.call(this._elRef.nativeElement.parentElement.children).indexOf(this._elRef.nativeElement);

    // Let's update and insert element in a correct position.
    if (this._svgContainer.getContainer().get(position) && this._circle.position() !== position) {
      this._circle.insertBefore(this._svgContainer.getContainer().get(position));
    }
  }

  /**
   * Adds classes to the circle object.
   * @param classesToAdd - List of classes, which needs to be added.
   * @param classesToRemove - List of classes, which needs to be removed.
   */
  private addRemoveClasses(classesToAdd: string[], classesToRemove: string[] = []): void {
    // First let's remove classes, that are not necessary anymore
    for (const classToRemove of classesToRemove) {
      this._circle
        .removeClass(classToRemove);
    }

    // Now let's add new classes
    for (const classToAdd of classesToAdd) {
      this._circle
        .addClass(classToAdd);
    }
  }
}
