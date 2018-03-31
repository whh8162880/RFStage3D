///<reference path="./DisplayObject.ts" />
module rf{
    export class DisplayObjectContainer extends DisplayObject{
        constructor(){
            super();
            this.childrens = [];
        }

        protected _childrenChange:boolean = false;

        setChange(value: number,p:boolean = false,c:boolean = false): void {
            if(true == c){
                this._childrenChange = p;
                if(this.parent){
                    this.parent.setChange(value,p,true);
                }
            }else{
                super.setChange(value);
            }
        }
        public childrenChange(){
            this._childrenChange = true;
            if(undefined != this.parent){
                this.parent.childrenChange()
            }
        }

        public childrens:DisplayObject[];

        public get numChildren():number{
            return this.childrens.length;
        }


        public addChild(child:DisplayObject):void{
            if(undefined == child || child == this) return;
            if(child.parent) child.remove();

            this.childrens.push(child);
            child.parent = this;
            //需要更新Transform
            this.setChange(DChange.base_all)
            if(this.stage){
                if(!child.stage){
                    child.stage = this.stage;
                    child.addToStage();
                }
            }
        }


        public addChildAt(child:DisplayObject,index:number):void{
            if(undefined == child || child == this) return;
            if(child.parent) child.remove();

            if(index < 0 ){
				index = 0;
			}else if(index > this.childrens.length){
				index = this.childrens.length;
            }

            this.childrens.splice(index,0,child);

            child.parent = this;
            //需要更新Transform
            this.setChange(DChange.base_all)
            if(this.stage){
                if(!child.stage){
                    child.stage = this.stage;
                    child.addToStage();
                }
            }
        }


        public getChildIndex(child:DisplayObject):number{
			return this.childrens.indexOf(child);
        }
        
        public removeChild(child:DisplayObject):void{
			
			if(undefined == child){
				return;
			}
			
			var i:number = this.childrens.indexOf(child);
			if(i==-1){
				return;
			}
            this.childrens.splice(i,1);
			child.stage = undefined;
			child.parent = undefined;
			child.removeFromStage();
		}


        public removeAllChild():void{
			for(let child of this.childrens){
				child.stage = undefined;
				child.parent = undefined;
				child.removeFromStage();
			}
			this.childrens.length = 0;
        }
        
        public removeFromStage():void{
			for(let child of this.childrens){
				child.stage = undefined
				child.removeFromStage();
			}
			super.removeFromStage();
		}
		
		
		public addToStage():void{
			for(let child of this.childrens){
				child.stage = this.stage;
				child.addToStage();
			}
        }
        
		/**
         * 讲真  这块更新逻辑还没有到最优化的结果 判断不会写了
         */
		public updateTransform():void{
            if(this._change & DChange.trasnform){
                //如果自己的transform发生了变化
                //  step1 : 更新自己的transform
                //  step2 : 全部子集都要更新sceneTransform;
                super.updateTransform();
                this.updateSceneTransform();
            }

            if(this._change & DChange.alpha){
                this.updateAlpha(this.parent.sceneAlpha);
            }

            if(true == this._childrenChange){
                for(let child of this.childrens){
                    if(child instanceof DisplayObjectContainer){
                        if(child._change || child._childrenChange){
                            child.updateTransform();
                        }
                    }else{
                        if(child._change | DChange.trasnform){
                            child.updateTransform();
                            child.updateSceneTransform(this.sceneTransform);
                        }

                        if(child._change | DChange.alpha){
                            child.updateAlpha(this.sceneAlpha);
                        }
                    }
                }
                this._childrenChange = false;
            }
        }
        

        public updateSceneTransform(): void {
            this.sceneTransform.copyFrom(this.transform);
            if (this.parent) this.sceneTransform.append(this.parent.sceneTransform);
            for(let child of this.childrens){
                if( (child._change & DChange.trasnform) != 0){
                    //这里不更新其transform 是因为后续有人来让其更新
                    child.updateSceneTransform(this.sceneTransform);
                }
            }
        }


        public updateAlpha(sceneAlpha:number):void{
            this.sceneAlpha = sceneAlpha * this._alpha;
            for(let child of this.childrens){
                child.updateAlpha(this.sceneAlpha);
            }
            this._change &= ~DChange.alpha;
        }
    }
}