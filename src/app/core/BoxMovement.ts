import { IMoveable } from "./IMoveable";
import { Point, Rectangular } from "./Rectangle";
import { ResizingPoint } from "./ResizingPoint";

export class BoxMovement implements IMoveable {

    private moveableShape?: Rectangular = undefined;
    private initialLocation?: Point = undefined;
    private htmlElement?: HTMLElement = undefined;
    private resizingPoints: ResizingPoint;

    constructor(resizingPoints: ResizingPoint) {
        this.resizingPoints = resizingPoints;
    }

    public updateMovement(drag: Point): boolean {

        if (this.moveableShape) {

            let new_x = this.initialLocation!.x + drag.x;
            let new_y = this.initialLocation!.y + drag.y;

            if (new_x >= 0) {
                this.moveableShape.x = new_x;
            }

            if (new_y >= 0) {
                this.moveableShape.y = new_y;
            }

            this.resizingPoints.updateBoxBoundary(this.moveableShape);
            return true
        }

        return false;

    }


    public activateBox(rect: Rectangular, element: HTMLElement) {
        this.initialLocation = { x: rect.x, y: rect.y };
        this.moveableShape = rect;
        this.htmlElement = element;
        element.classList.add("active_rect");
    }

    public deactivateBox() {
        this.initialLocation = undefined;
        this.moveableShape = undefined;
        this.htmlElement!.classList.remove("active_rect");
    }
}