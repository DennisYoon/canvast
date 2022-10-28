class Canvast {
  /**
   * @param {string} canvasID 
   */
  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID).getContext("2d");
    this.span = 0; // 나누기 60 = 초
    this.objects = {};
  }

  /**
   * @param {string} name object name
   * @param {string} content object content
   */
  add(name, content) {
    const paramExist = [name, content].every(v => v !== undefined);
    const uniqueKey = !(name in this.objects);
    if (paramExist) {
      if (uniqueKey) {
        this.objects[name] = content;
      } else {
        console.error(`CANVAST.JS : added exist object '${name}'`);
      }
    } else {
      console.error(`CANVAST.JS : added undefined name or content or both`);
    }
  }

  /**
   * @param {(ctx: HTMLCanvasElement) => void} callback 
   */
  classic(callback) {
    callback(this.canvas);
  }

  /**
   * @param {Generator<void, void, unknown>[]} tasksNoCall generator functions
   */
  show(tasksNoCall) {
    return new Promise(res => {
      let tasks = tasksNoCall.map(v => v());
      let taskDown = Array(tasks.length).fill(false);
      function animate() {
        console.log(taskDown, this.span);
        tasks.forEach((t, i) => t.next().done ? taskDown[i] = true : void(0));
        this.span++;
        if (taskDown.every(v => v)) {
          res();
          return;
        }
        requestAnimationFrame(animate.bind(this));
      }
      animate.call(this);
    });
  }
}

const c = new Canvast("canvas1");

function* task1() {
  yield c.add("hello world");
  yield console.log("wow world");
  yield c.classic((ctx) => {
    ctx.rect(20, 20, 150, 100);
    ctx.stroke();
  })
}

function* task2() {
  yield c.add("hello world", "there you are");
  yield console.log("good morning world", "there use are");
}

c.show([task1, task2]).then(() => {
  console.log(c.objects);
});