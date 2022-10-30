class Canvast {
  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID).getContext("2d");
    this.framesec = 0; // 나누기 60 = 초
    this.objects = {};
    this.taskPause = [];
    this.presentRunningTaskIdx = 0;
  }

  add(name, content) {
    this.objects[name] = content;
  }

  remove(name) {
    delete this.objects[name];
  }

  wait(sec) {
    return {
      framesec: () => {
        this.taskPause[this.presentRunningTaskIdx] = sec;
      },
      second: () => {
        this.taskPause[this.presentRunningTaskIdx] = sec * 60;
      }
    };
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
          self.presentRunningTaskIdx = i;
          if (this.taskPause[i] > 0) {
            this.taskPause[i]--;
          } else if (task.next().done) {
            taskDown[i] = true;
          }
        });
        this.framesec++;
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
  yield c.wait(2).second();
  for (let i = 0; i < 100; i++) {
    yield c.classic((ctx) => {
      ctx.rect(20, 20, 150, 100);
      ctx.stroke();
    });
  }
  
}

c.show(task1);