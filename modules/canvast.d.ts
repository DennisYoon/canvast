interface ObjectT {
    name: string;
    content: Rect;
}
interface propertiesT {
    width: number;
    height: number;
    clearCanvastWhenDone: boolean;
}
declare type TaskGenerator = Generator<any, void, void>;
declare const basicProperties: propertiesT;
declare class Canvast {
    private properties;
    private fs;
    private objects;
    private taskPause;
    private nowTaskIdx;
    private canvas;
    constructor(element: Element, properties?: propertiesT);
    add(name: string, content: Rect): void;
    remove(name: string): void;
    o(name: string): Rect;
    wait4(sec: number): void;
    classic(callback: (ctx: CanvasRenderingContext2D) => void): void;
    show(...tasksNoCallSpread: (() => Generator<Canvast, void, void>)[]): Promise<void>;
    cout(): void;
    clearScreen(): void;
}
declare class Obj {
    basicAtt: {
        visible: boolean;
        fillColor: string;
        strokeColor: string;
    };
}
declare class Rect extends Obj {
    att: {
        width: any;
        height: any;
        x?: number;
        y?: number;
        visible?: boolean;
        fillColor?: string;
        strokeColor?: string;
    };
    constructor();
    showAt(ctx: CanvasRenderingContext2D): void;
    addWidth(number: number): void;
    setWidth(number: number): void;
    addHeight(number: number): void;
    setHeight(number: number): void;
}
declare const canvas: Element;
declare const c: Canvast;
declare function t1(): TaskGenerator;
