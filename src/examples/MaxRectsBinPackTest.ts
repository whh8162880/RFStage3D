/// <reference path="../com/youbt/rfreference.ts" />
module rf{
    export class MaxRectsBinPackTest{
        public binpack:MaxRectsBinPack;
        constructor(){
            var rect:Rect;
            this.binpack = new MaxRectsBinPack(100,100);
            rect = this.binpack.insert(50,50);
            rect = this.binpack.insert(50,50);
            rect = this.binpack.insert(50,50);
            rect = this.binpack.insert(50,50);
            rect = this.binpack.insert(50,50);
        }
    }
}