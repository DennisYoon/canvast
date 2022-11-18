class NonRecursiveObjectConcurrencyHtmlCanvasDevelopmentHelperLibraryBasedOnGeneratorFunctionForJavaScript {
  fs = 0; // / 60 = second
  objects = {};
  taskPause = [];
  nowTaskIdx = 0;

  constructor(element, properties = {
    canvasWidth: 0,
    canvasHeight: 0,
    clearScreenWhenExecutionFinished: true
  }) {
    this.canvas = element.getContext("2d");
    this.properties = properties;
  }
  
  add(name, content) {
    this.objects[name] = content;
  }

  remove(name) {
    delete this.objects[name];
  }

  o(name) {
    return this.objects[name];
  }

  wait4(sec) {
    this.taskPause[this.nowTaskIdx] = sec;
  }

  classic(callback) {
    callback(this.canvas);
  }

  show(...tasksNoCallSpread) {
    const tasksNoCall = [...tasksNoCallSpread];
    return new Promise(res => {
      let tasks = tasksNoCall.map(v => v());
      let taskDown = Array(tasks.length).fill(false);
      this.taskPause = Array(tasks.length).fill(0);

      function animate() {
        if (taskDown.every(v => v)) {
          if (this.properties.clearScreenWhenExecutionFinished) {
            this.clearScreen();
          }
          res();
          return;
        }

        const self = this;
        this.clearScreen();
        tasks.forEach((task, i) => {
          self.nowTaskIdx = i;
          if (this.taskPause[i] > 0) {
            this.taskPause[i]--;
          } else if (task.next().done) {
            taskDown[i] = true;
          }
        });
        this.fs++;

        for (let object of Object.values(this.objects)) {
          object.showAt(this.canvas);
        }
        requestAnimationFrame(animate.bind(this));
      }

      animate.call(this);
    });
  }

  cout() {
    const g = globalThis;
    g.add = (name, content) => this.add(name, content);
    g.remove = (name) => this.remove(name);
    g.wait4 = (sec) => this.wait4(sec);
    g.classic = (callback) => this.classic(callback);
  }

  clearScreen() {
    this.canvas.fillStyle = "white";
    this.canvas.fillRect(
      0, 0,
      this.properties.canvasWidth, this.properties.canvasHeight
    );
  }
}

class Obj {
  att = {
    visible: true,
    fillColor: "red",
    strokeColor: "red"
  }
}

class Rect extends Obj {
  constructor() {
    super();
    this.att = {
      ...this.att,
      width: 10,
      height: 20,
      x: 10,
      y: 10
    };
  }

  showAt(ctx) {
    const atts = this.att;
    ctx.fillStyle = atts.fillColor;
    ctx.strokeStyle = atts.strokeColor;
    ctx.fillRect(
      atts.x, atts.y,
      atts.x + atts.width, atts.y + atts.height
    );
  }

  addWidth(number) {
    this.att.width += number;
  }

  setWidth(number) {
    this.att.width = number;
  }

  addHeight(number) {
    this.att.height += number;
  }

  setHeight(number) {
    this.att.height = number;
  }
}

function canvast(e) {
  return new Canvast(e);
};


/** **/
const canvas = document.querySelector("#canvas1");
const c = new NonRecursiveObjectConcurrencyHtmlCanvasDevelopmentHelperLibraryBasedOnGeneratorFunctionForJavaScript(canvas, {
  canvasWidth: 400,
  canvasHeight: 400,
  clearScreenWhenExecutionFinished: false
});

function* t1() {
  yield c.add("rect1", new Rect());
  for (let i = 0; i < 100; i++) {
    yield c.o("rect1").addWidth(1);
  }
  yield c.o("rect1").setWidth(10);
}

c.show(t1);