/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
module rf {
    export class AppBase implements ITickable {
        constructor() {
            Engine.start();
            ROOT = singleton(Stage3D)
        }

        public update(now: number, interval: number): void {}

    }

}