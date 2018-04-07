///<reference path="./CONFIG.ts" />
///<reference path="./Geom.ts" />
module rf {
    export class BitmapData {
        private _rect: { x: number; y: number; width: number; height: number };
        private _transparent;
        public canvas: HTMLCanvasElement;
        public context: CanvasRenderingContext2D;
        //private _imageData:ImageData;

        public constructor(width: number, height: number, transparent: boolean = true, fillColor: number = 0xFFFFFFFF) {
            this._transparent = transparent;
            let canvas = this.canvas = <HTMLCanvasElement>document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            this.context = this.canvas.getContext("2d");
            this._rect = { x: 0, y: 0, width: width, height: height };
            if (!transparent)
                this.fillRect(0,0,width,height,hexToCSS(fillColor,1));
        }

        public static fromImageElement(img: HTMLImageElement): BitmapData {
            var bmd: BitmapData = new BitmapData(img.width, img.height, true);
            bmd.context.drawImage(<HTMLImageElement>img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            return bmd;
        }

        public get width(): number {
            return this.canvas.width;
        }
        public get height(): number {
            return this.canvas.height;
        }

        public get imageData(): ImageData {
            return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }

        public get rect(): { x: number; y: number; width: number; height: number } {
            return this._rect;
        }

        public copyPixels(sourceBitmapData: BitmapData, sourceRect: Size, destPoint: Point2D): void;
        public copyPixels(sourceBitmapData: HTMLImageElement, sourceRect: Size, destPoint: Point2D): void;
        public copyPixels(sourceBitmapData: any, sourceRect: Size, destPoint:Point2D): void {
            if (sourceBitmapData instanceof BitmapData)
                this.context.drawImage(sourceBitmapData.canvas, sourceRect.x, sourceRect.y, sourceRect.w, sourceRect.h, destPoint.x, destPoint.y, sourceRect.w, sourceRect.h);
            else {
                this.context.drawImage(<HTMLImageElement>sourceBitmapData, sourceRect.x, sourceRect.y, sourceRect.w, sourceRect.h, destPoint.x, destPoint.y, sourceRect.w, sourceRect.h);
            }
        }
        public draw(source: BitmapData /*,matrix:Matrix = null*/): void;
        public draw(source: HTMLImageElement /*,matrix:Matrix = null*/): void;
        public draw(source: any /*,matrix:Matrix = null*/): void //todo:draw matrix
        {
            if (source instanceof BitmapData)
                this.context.drawImage(source.canvas, 0, 0);
            else
                this.context.drawImage(source, 0, 0);
        }

        /**
         * rgbaCSS:string = "rgba(r,g,b,a)" rgba ∈ (0 ~ 255)
         */
        public fillRect( x: number, y: number, width: number, height: number,css:string| CanvasGradient | CanvasPattern): void {
            this.context.fillStyle = css;
            this.context.fillRect(x, y, width, height);
        }


        /**
         * convert decimal value to Hex
         */
        
    }

    export class MaxRectsBinPack {

        public static BESTSHORTSIDEFIT: number = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
        public static BESTLONGSIDEFIT: number = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
        public static BESTAREAFIT: number = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
        public static BOTTOMLEFTRULE: number = 3; ///< -BL: Does the Tetris placement.
        public static CONTACTPOINTRULE: number = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.


        public binWidth: number = 0;
        public binHeight: number = 0;
        public allowRotations: Boolean = false;

        public usedRects: Rect[] = [];
        public freeRects: Rect[] = [];

        private score1: number = 0; // Unused in this function. We don't need to know the score after finding the position.
        private score2: number = 0;
        private bestShortSideFit: number;
        private bestLongSideFit: number;

        constructor(width: number, height: number, rotations: boolean = false) {
            this.binWidth = width;
            this.binHeight = height;
            this.allowRotations = rotations;

            var n: Rect = new Rect();
            n.x = 0;
            n.y = 0;
            n.w = width;
            n.h = height;

            this.usedRects.length = 0;
            this.freeRects.length = 0;
            this.freeRects.push(n);
        }

        private count(n: number): Number {
            if (n >= 2)
                return this.count(n / 2);
            return n;
        }

        /**
         * 插入一个矩形
         * @param width
         * @param height
         * @param method
         * @return 插入的位置
         * 
         */
        public insert(width: number, height: number, method: number = 0): Rect {
            var newNode: Rect = new Rect();
            this.score1 = 0;
            this.score2 = 0;
            switch (method) {
                case MaxRectsBinPack.BESTSHORTSIDEFIT:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height);
                    break;
                case MaxRectsBinPack.BOTTOMLEFTRULE:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, this.score1, this.score2);
                    break;
                case MaxRectsBinPack.CONTACTPOINTRULE:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, this.score1);
                    break;
                case MaxRectsBinPack.BESTLONGSIDEFIT:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, this.score2, this.score1);
                    break;
                case MaxRectsBinPack.BESTAREAFIT:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, this.score1, this.score2);
                    break;
            }

            if (newNode.h == 0)
                return newNode;

            this.placeRect(newNode);
            return newNode;
        }

        private insert2(Rects: Rect[], dst: Rect[], method: number): void {
            dst.length = 0;

            while (Rects.length > 0) {
                var bestScore1: number = Infinity;
                var bestScore2: number = Infinity;
                var bestRectIndex: number = -1;
                var bestNode: Rect = new Rect();

                for (var i: number = 0; i < Rects.length; ++i) {
                    var score1: number = 0;
                    var score2: number = 0;
                    var newNode: Rect = this.scoreRect(Rects[i].w, Rects[i].h, method, score1, score2);

                    if (score1 < bestScore1 || (score1 == bestScore1 && score2 < bestScore2)) {
                        bestScore1 = score1;
                        bestScore2 = score2;
                        bestNode = newNode;
                        bestRectIndex = i;
                    }
                }

                if (bestRectIndex == -1)
                    return;

                this.placeRect(bestNode);
                Rects.splice(bestRectIndex, 1);
            }
        }

        private placeRect(node: Rect): void {
            var numRectsToProcess: number = this.freeRects.length;
            for (var i: number = 0; i < numRectsToProcess; i++) {
                if (this.splitFreeNode(this.freeRects[i], node)) {
                    this.freeRects.splice(i, 1);
                    --i;
                    --numRectsToProcess;
                }
            }

            this.
                //去重
                pruneFreeList();

            this.usedRects.push(node);
        }

        private scoreRect(width: number, height: number, method: number,
            score1: number, score2: number): Rect {
            var newNode: Rect = new Rect();
            score1 = Infinity;
            score2 = Infinity;
            switch (method) {
                case MaxRectsBinPack.BESTSHORTSIDEFIT:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height);
                    break;
                case MaxRectsBinPack.BOTTOMLEFTRULE:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, score1, score2);
                    break;
                case MaxRectsBinPack.CONTACTPOINTRULE:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, score1);
                    // todo: reverse
                    score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
                    break;
                case MaxRectsBinPack.BESTLONGSIDEFIT:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                    break;
                case MaxRectsBinPack.BESTAREAFIT:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                    break;
            }

            // Cannot fit the current Rect.
            if (newNode.h == 0) {
                score1 = Infinity;
                score2 = Infinity;
            }

            return newNode;
        }

        /// Computes the ratio of used surface area.
        private occupancy(): number {
            var usedSurfaceArea: number = 0;
            for (var i: number = 0; i < this.usedRects.length; i++)
                usedSurfaceArea += this.usedRects[i].w * this.usedRects[i].h;

            return usedSurfaceArea / (this.binWidth * this.binHeight);
        }

        private findPositionForNewNodeBottomLeft(width: number, height: number,
            bestY: number, bestX: number): Rect {
            var bestNode: Rect = new Rect();
            //memset(bestNode, 0, sizeof(Rect));

            bestY = Infinity;
            var rect: Rect;
            var topSideY: number;
            for (var i: number = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    topSideY = rect.y + height;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestY = topSideY;
                        bestX = rect.x;
                    }
                }
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    topSideY = rect.y + width;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestY = topSideY;
                        bestX = rect.x;
                    }
                }
            }
            return bestNode;
        }

        private findPositionForNewNodeBestShortSideFit(width: number, height: number): Rect {
            var bestNode: Rect = new Rect();
            this.
                //memset(&bestNode, 0, sizeof(Rect));
                bestShortSideFit = Infinity;
            this.bestLongSideFit = this.score2;
            var rect: Rect;
            var leftoverHoriz: number;
            var leftoverVert: number;
            var shortSideFit: number;
            var longSideFit: number;

            for (var i: number = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    leftoverHoriz = Math.abs(rect.w - width);
                    leftoverVert = Math.abs(rect.h - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);

                    if (shortSideFit < this.bestShortSideFit || (shortSideFit == this.bestShortSideFit && longSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        this.bestShortSideFit = shortSideFit;
                        this.bestLongSideFit = longSideFit;
                    }
                }
                var flippedLeftoverHoriz: number;
                var flippedLeftoverVert: number;
                var flippedShortSideFit: number;
                var flippedLongSideFit: number;
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    flippedLeftoverHoriz = Math.abs(rect.w - height);
                    flippedLeftoverVert = Math.abs(rect.h - width);
                    flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                    flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);

                    if (flippedShortSideFit < this.bestShortSideFit || (flippedShortSideFit == this.bestShortSideFit && flippedLongSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        this.bestShortSideFit = flippedShortSideFit;
                        this.bestLongSideFit = flippedLongSideFit;
                    }
                }
            }

            return bestNode;
        }

        private findPositionForNewNodeBestLongSideFit(width: number, height: number, bestShortSideFit: number, bestLongSideFit: number): Rect {
            var bestNode: Rect = new Rect();
            //memset(&bestNode, 0, sizeof(Rect));
            bestLongSideFit = Infinity;
            var rect: Rect;

            var leftoverHoriz: number;
            var leftoverVert: number;
            var shortSideFit: number;
            var longSideFit: number;
            for (var i: number = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    leftoverHoriz = Math.abs(rect.w - width);
                    leftoverVert = Math.abs(rect.h - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);

                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }

                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    leftoverHoriz = Math.abs(rect.w - height);
                    leftoverVert = Math.abs(rect.h - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);

                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
            }
            return bestNode;
        }

        private findPositionForNewNodeBestAreaFit(width: number, height: number, bestAreaFit: number, bestShortSideFit: number): Rect {
            var bestNode: Rect = new Rect();
            //memset(&bestNode, 0, sizeof(Rect));

            bestAreaFit = Infinity;

            var rect: Rect;

            var leftoverHoriz: number;
            var leftoverVert: number;
            var shortSideFit: number;
            var areaFit: number;

            for (var i: number = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                areaFit = rect.w * rect.h - width * height;

                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    leftoverHoriz = Math.abs(rect.w - width);
                    leftoverVert = Math.abs(rect.h - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }

                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    leftoverHoriz = Math.abs(rect.w - height);
                    leftoverVert = Math.abs(rect.h - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
            }
            return bestNode;
        }

        /// Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
        private commonIntervalLength(i1start: number, i1end: number, i2start: number, i2end: number): number {
            if (i1end < i2start || i2end < i1start)
                return 0;
            return Math.min(i1end, i2end) - Math.max(i1start, i2start);
        }

        private contactPointScoreNode(x: number, y: number, width: number, height: number): number {
            var score: number = 0;

            if (x == 0 || x + width == this.binWidth)
                score += height;
            if (y == 0 || y + height == this.binHeight)
                score += width;
            var rect: Rect;
            for (var i: number = 0; i < this.usedRects.length; i++) {
                rect = this.usedRects[i];
                if (rect.x == x + width || rect.x + rect.w == x)
                    score += this.commonIntervalLength(rect.y, rect.y + rect.h, y, y + height);
                if (rect.y == y + height || rect.y + rect.h == y)
                    score += this.commonIntervalLength(rect.x, rect.x + rect.w, x, x + width);
            }
            return score;
        }

        private findPositionForNewNodeContactPoint(width: number, height: number, bestContactScore: number): Rect {
            var bestNode: Rect = new Rect();
            //memset(&bestNode, 0, sizeof(Rect));

            bestContactScore = -1;

            var rect: Rect;
            var score: number;
            for (var i: number = 0; i < this.freeRects.length; i++) {
                rect = this.freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rect.w >= width && rect.h >= height) {
                    score = this.contactPointScoreNode(rect.x, rect.y, width, height);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = width;
                        bestNode.h = height;
                        bestContactScore = score;
                    }
                }
                if (this.allowRotations && rect.w >= height && rect.h >= width) {
                    score = this.contactPointScoreNode(rect.x, rect.y, height, width);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.w = height;
                        bestNode.h = width;
                        bestContactScore = score;
                    }
                }
            }
            return bestNode;
        }

        private splitFreeNode(freeNode: Rect, usedNode: Rect): Boolean {
            // Test with SAT if the Rects even intersect.
            if (usedNode.x >= freeNode.x + freeNode.w || usedNode.x + usedNode.w <= freeNode.x ||
                usedNode.y >= freeNode.y + freeNode.h || usedNode.y + usedNode.h <= freeNode.y)
                return false;
            var newNode: Rect;
            if (usedNode.x < freeNode.x + freeNode.w && usedNode.x + usedNode.w > freeNode.x) {
                // New node at the top side of the used node.
                if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.h) {
                    newNode = freeNode.clone();
                    newNode.h = usedNode.y - newNode.y;
                    this.freeRects.push(newNode);
                }

                // New node at the bottom side of the used node.
                if (usedNode.y + usedNode.h < freeNode.y + freeNode.h) {
                    newNode = freeNode.clone();
                    newNode.y = usedNode.y + usedNode.h;
                    newNode.h = freeNode.y + freeNode.h - (usedNode.y + usedNode.h);
                    this.freeRects.push(newNode);
                }
            }

            if (usedNode.y < freeNode.y + freeNode.h && usedNode.y + usedNode.h > freeNode.y) {
                // New node at the left side of the used node.
                if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.w) {
                    newNode = freeNode.clone();
                    newNode.w = usedNode.x - newNode.x;
                    this.freeRects.push(newNode);
                }

                // New node at the right side of the used node.
                if (usedNode.x + usedNode.w < freeNode.x + freeNode.w) {
                    newNode = freeNode.clone();
                    newNode.x = usedNode.x + usedNode.w;
                    newNode.w = freeNode.x + freeNode.w - (usedNode.x + usedNode.w);
                    this.freeRects.push(newNode);
                }
            }

            return true;
        }

        private pruneFreeList(): void {
            for (var i: number = 0; i < this.freeRects.length; i++)
                for (var j: number = i + 1; j < this.freeRects.length; j++) {
                    if (this.isContainedIn(this.freeRects[i], this.freeRects[j])) {
                        this.freeRects.splice(i, 1);
                        break;
                    }
                    if (this.isContainedIn(this.freeRects[j], this.freeRects[i])) {
                        this.freeRects.splice(j, 1);
                    }
                }
        }

        private isContainedIn(a: Rect, b: Rect): Boolean {
            return a.x >= b.x && a.y >= b.y
                && a.x + a.w <= b.x + b.w
                && a.y + a.h <= b.y + b.h;
        }
    }
}