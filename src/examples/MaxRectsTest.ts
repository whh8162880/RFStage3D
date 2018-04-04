module rf {
    export class MaxRectsTest {

        private _urls = [
            "http://shushanh5.com/web/data/zhcn/n/a/B001/i3.png",
            "http://shushanh5.com/web/data/zhcn/o/server/logo.png",
            "http://shushanh5.com/web/data/zhcn/m/1/mini.jpg",
        ];

        private _count: number = 0;

        private _images: HTMLImageElement[];

        constructor() {
            this._images = [];
            loadRes(this._urls, this.onComplete, this, ResType.image);
        }

        private onComplete(event: EventX) {
            if (event.type == EventT.COMPLETE) {
                let data = event.data as ResItem;
                if (data.type == ResType.image) {
                    this._images.push(data.data);
                }
            }

            this._count++;
            if (this._count >= this._urls.length) {
                this.drawMaxRect();
            }
        }

        private drawMaxRect() {
            let canvas = document.createElement("canvas");
            document.body.appendChild(canvas);

            canvas.width = 512;
            canvas.height = 512;

            let context = canvas.getContext("2d");

            let rect:Rect;
            let binpack = new MaxRectsBinPack(512, 512);
            for (let img of this._images) {
                rect = binpack.insert(img.width, img.height);
                context.drawImage(img, rect.x, rect.y);
            }

            let text = "我前面有不少关于canvas的文章，其中最近一篇是关于canvas绘制video，其实canvas的功能还有很多，我们还可以利用canvas来过滤视频纯色背景，还可以获取图片背景颜色。这里用到了canvas的一个ImageData 对象，今天就介绍一下canvas的ImageData 对象及其应用！";
            let map = {};
            for (let char of text) {
                map[char] = true;
            }
            let s = "";
            for (let key in map) {
                s += key;
            }
            s = s.replace(/\s/g, "");

            // console.log(s);

            for (let char of s) {

                context.font = "30px Arial";

                let w = context.measureText(char).width;
                let h = 30;

                rect = binpack.insert(w, h);

                context.fillStyle = 'rgb(255, 255, 255)';
                context.fillText(char, rect.x, rect.y + h, w);

            }

        }
    }
}