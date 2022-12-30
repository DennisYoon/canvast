const basicProperties = {
    width: 0,
    height: 0,
    clearCanvastWhenDone: false
};
class Canvast {
    constructor(element, properties = basicProperties) {
        this.properties = properties;
        this.fs = 0; // divide 60 = second
        this.objects = [];
        this.taskPause = [];
        this.nowTaskIdx = 0;
        this.canvas = element.getContext("2d");
        console.log(this.nowTaskIdx);
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
                    }
                    else if (task.next().done) {
                        taskDown[i] = true;
                    }
                });
                this.fs++;
                for (let object of Object.keys(c.objects).map(v => c.objects[v])) {
                    object.showAt(this.canvas);
                }
                requestAnimationFrame(animate);
            };
            animate();
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
        this.canvas.fillRect(0, 0, this.properties.width, this.properties.height);
    }
}
class Obj {
    constructor() {
        this.basicAtt = {
            visible: true,
            fillColor: "red",
            strokeColor: "red"
        };
    }
}
class Rect extends Obj {
    constructor() {
        super();
        this.att = Object.assign(Object.assign({}, this.basicAtt), { width: 10, height: 20, x: 10, y: 10 });
    }
    showAt(ctx) {
        const atts = this.att;
        ctx.fillStyle = atts.fillColor;
        ctx.strokeStyle = atts.strokeColor;
        ctx.fillRect(atts.x, atts.y, atts.x + atts.width, atts.y + atts.height);
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
/* TEST CODES */
const canvas = document.querySelector("#canvas1");
const c = new Canvast(canvas, {
    width: 400,
    height: 400,
    clearCanvastWhenDone: false
});
function* t1() {
    yield c.add("redRect", new Rect());
    for (let i = 0; i < 100; i++) {
        yield c.o("redRect").addWidth(1);
    }
}
c.show(t1);
