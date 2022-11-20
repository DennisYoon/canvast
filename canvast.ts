interface ObjectT {
  name: string;
  content: Rect;
}

interface propertiesT {
  width: number,
  height: number,
  clearCanvastWhenDone: boolean
}

type TaskGenerator = Generator<any, void, void>;

const basicProperties: propertiesT = {
  width: 0,
  height: 0,
  clearCanvastWhenDone: false
} as const;

class Canvast {
  private fs: number = 0; // divide 60 = second
  private objects: ObjectT[] = [];
  private taskPause: number[] = [];
  private nowTaskIdx: number = 0;
  private canvas: CanvasRenderingContext2D;

  constructor(
    element: Element,
    private properties: propertiesT = basicProperties
  ) {
    this.canvas = (element as HTMLCanvasElement).getContext("2d");
    console.log(this.nowTaskIdx);
  }

  add(name: string, content: Rect) {
    this.objects[name] = content;
  }

  remove(name: string) {
    delete this.objects[name];
  }

  o(name: string): Rect {
    return this.objects[name];
  }

  wait4(sec: number) {
    this.taskPause[this.nowTaskIdx] = sec;
  }

  classic(callback: (ctx: CanvasRenderingContext2D) => void) {
    callback(this.canvas);
  }

  show(...tasksNoCallSpread: (() => Generator<Canvast, void, void>)[]) {
    const tasksNoCall = [...tasksNoCallSpread];
    return new Promise<void>(res => {
      let tasks = tasksNoCall.map(v => v());
      let taskDown = Array(tasks.length).fill(false);
      this.taskPause = Array(tasks.length).fill(0);

      const animate = () => {
        if (taskDown.every(v => v)) {
          if (this.properties.clearCanvastWhenDone) {
            this.clearScreen();
          }
          res();
          return;
        }

        this.clearScreen();
        tasks.forEach((task, i) => {
          this.nowTaskIdx = i;
          if (this.taskPause[i] > 0) {
            this.taskPause[i]--;
          } else if (task.next().done) {
            taskDown[i] = true;
          }
        });
        this.fs++;

        for (let object of Object.keys(c.objects).map(v => c.objects[v])) {
          object.showAt(this.canvas);
        }
        requestAnimationFrame(animate);
      }

      animate();
    });
  }

  cout() {
    const g = globalThis;
    g.add = (name: string, content: Rect) => this.add(name, content);
    g.remove = (name: string) => this.remove(name);
    g.wait4 = (sec: number) => this.wait4(sec);
    g.classic = (callback: (ctx: CanvasRenderingContext2D) => void) => this.classic(callback);
  }

  clearScreen() {
    this.canvas.fillStyle = "white";
    this.canvas.fillRect(
      0, 0,
      this.properties.width, this.properties.height
    );
  }
}

class Obj {
  basicAtt = {
    visible: true,
    fillColor: "red",
    strokeColor: "red"
  }
}

class Rect extends Obj {
  att: { width: any; height: any; x?: number; y?: number; visible?: boolean; fillColor?: string; strokeColor?: string; };
  constructor() {
    super();
    this.att = {
      ...this.basicAtt,
      width: 10,
      height: 20,
      x: 10,
      y: 10
    };
  }

  showAt(ctx: CanvasRenderingContext2D) {
    const atts = this.att;
    ctx.fillStyle = atts.fillColor;
    ctx.strokeStyle = atts.strokeColor;
    ctx.fillRect(
      atts.x, atts.y,
      atts.x + atts.width, atts.y + atts.height
    );
  }

  addWidth(number: number) {
    this.att.width += number;
  }

  setWidth(number: number) {
    this.att.width = number;
  }

  addHeight(number: number) {
    this.att.height += number;
  }

  setHeight(number: number) {
    this.att.height = number;
  }
}

/** */

const canvas = document.querySelector("#canvas1");
const c = new Canvast(canvas, {
  width: 400,
  height: 400,
  clearCanvastWhenDone: false
});

function* t1(): TaskGenerator {
  yield c.add("redRect", new Rect());
  for (let i = 0; i < 100; i++) {
    yield c.o("redRect").addWidth(1);
  }
}

c.show(t1);