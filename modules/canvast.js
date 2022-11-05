class Canvast {
  fs = 0; // / 60 = second
  objects = {};
  taskPause = [];
  nowTaskIdx = 0;

  constructor(element) {
    this.canvas = element.getContext("2d");
  }
  
  add(name, content) {
    this.objects[name] = content;
  }

  remove(name) {
    delete this.objects[name];
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
        const self = this;
        this.canvas.fillStyle = "white";
        this.canvas.fillRect(0, 0, 400, 400);
        tasks.forEach((task, i) => {
          self.nowTaskIdx = i;
          if (this.taskPause[i] > 0) {
            this.taskPause[i]--;
          } else if (task.next().done) {
            taskDown[i] = true;
          }
        });
        this.fs++;
        if (taskDown.every(v => v)) {
          res();
          return;
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
}

function canvast(e) {
  return new Canvast(e)
};


const canvas = document.querySelector("#canvas1");
const c = canvast(canvas);
c.cout();

function* task1() {
  yield wait4(20);
  console.log("waited");
  for (let i = 0; i < 100; i++) {
    yield classic((ctx) => {
      ctx.rect(20, 20, 150, 100);
      ctx.stroke();
    });
  }
  
}

c.show(task1);