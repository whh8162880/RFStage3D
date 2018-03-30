///<reference path="./DisplayObject.ts" />
module rf{
    export class DisplayObjectContainer extends DisplayObject{
        constructor(){
            super();
            this.childrens = [];
        }

        private _childrenChange:boolean = false;
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
		
		public updateTransform():void{
			super.updateTransform();
			for(let child of this.childrens){
				child.change = true;
			}
		}

    }
}