module rf{

    export class Byte{
        position:number;
        length:number;
        buf:DataView;

        constructor(buf:ArrayBuffer){
            this.buf = new DataView(buf);
            this.length = buf.byteLength;
            this.position = 0;
        }

        outOfRange(){

        }

        readByte(){
            const{position}=this;
            if(position >= this.length) this.outOfRange();
            let b = this.buf.getUint8(position); 
            this.position ++;
            return b;
        }

        readInt(){
            const{position}=this;
            if(position + 4 >= this.length) { this.outOfRange(); return; }
            let b = this.buf.getInt32(position); 
            this.position = position + 4;
            return b;
        }

        readUInt(){
            const{position}=this;
            if(position + 4 >= this.length) { this.outOfRange(); return; }
            let b = this.buf.getUint32(position); 
            this.position = position + 4;
            return b;
        }

        readDouble(){
            const{position}=this;
            if(position + 8 >= this.length) { this.outOfRange(); return; }
            let b = this.buf.getFloat64(position); 
            this.position = position + 8;
            return b;
        }

        readFloat(){
            const{position}=this;
            if(position + 4 >= this.length) { this.outOfRange(); return; }
            let b = this.buf.getFloat32(position); 
            this.position = position + 4;
            return b;
        }


        readMultiByte(length:number, charSet:string="utf-8"):string  {
            const{position,buf}=this;

            let str = "";
            for (var i:number = 0; i < length;i++ ){
                str += String.fromCharCode(buf.getUint8(position + i));
            }

			// try{
			// 	var u8 = new Uint8Array(length);
			// 	u8.set(new Uint8Array(buf.buffer.slice(position, position + length)));
			// 	var decoder = new TextDecoder(charSet);
			// 	var str = decoder.decode(u8);
			// }catch (err){
			// 	//str = String.fromCharCode.apply(null, u8);
			// 	str = "";
			// 	for (var i:number = 0; i < length;i++ ){
			// 		str += String.fromCharCode(buf.getUint8(position + i));
			// 	}
			// }
			this.position += length;
			return str;
        }
        
        readByteArray(length:number):ArrayBuffer{
            const{position}=this;
            let buf = this.buf.buffer.slice(position,position+length);
            this.position += length;
            return buf;
        }
    }



    export enum AMF3Define{
        UNDEFINED = 0x00,
        NULL = 0x01,
        FALSE = 0x02,
        TRUE = 0x03,
        // These markers represent a following value.
        INT = 0x04,
        DOUBLE = 0x05,
        STRING = 0x06,
        XMLDOC = 0x07,
        DATE = 0x08,
        ARRAY = 0x09,
        OBJECT = 0x0A,
        XML = 0x0B,
        BYTEARRAY = 0x0C,
        INTVECTOR = 0x0D,
        UINTVECTOR = 0x0E,
        DOUBLEVECTOR = 0x0F,
        OBJECTVECTOR = 0x10,
        DICTIONARY = 0x11
    }

    export class ClassDefine{
        className:string;
        members:string[];
        isExternalizable:boolean;
        isDynamic:boolean;
        constructor(className:string,members:string[]){

        }
    }

    export class AMF3 extends Byte{
        flags = 0;
        ref;
        stringsTable = [];
        objectsTable = [];
        traitsTable = [];
        clsNameMap = {};

        MASK = 1 << 28;

        constructor(buf:ArrayBuffer){
            super(buf);
        }

        private readU29():number{
			let value = this.readByte() & 0xff;
			if (value < 128){
				return value;
			}
			let tmp;
			value = (value & 0x7f) << 7;
			tmp = this.readByte()&0xff;
			if (tmp < 128){
				value = value | tmp;
			}else{
				value = (value | tmp & 0x7f) << 7;
				tmp = this.readByte()&0xff;
				if (tmp < 128){
					value = value | tmp;
				}else{
					value = (value | tmp & 0x7f) << 8;
					tmp = this.readByte()&0xff;
					value = value | tmp;
				}
			}
			return -(value & this.MASK) | value;
		}

        readInt(){
            return this.readU29();
        }


        readString():string{
            let handle = this.readU29();
            let inline = (handle & 1) != 0;
            handle = handle >> 1;
            if(inline)
			{
				if (0 == handle){
					return "";
				}
				var str = this.readMultiByte(handle);
				this.stringsTable.push(str);
				return str;
			}
			
			return this.stringsTable[handle];

        }

        readDate(u29D:number):Date{
            return new Date(this.readDouble());
        }


        readObjectVector(length:number){
            let fixed = this.readU29();
            let list = [];
            
			this.objectsTable.push(list);
			
			let index = -1;
			while(++index<length){
				list[index]=this.readObject();
			}
			
			return list;
        }


        readArray(length:number){
            const{objectsTable}=this;
			let instance = [];
			
            objectsTable.push(instance);
            let key:string;
			while(key = this.readString()){
				instance[key]=this.readObject();
			}
			var index = -1;
			while(++index<length){
				instance[index]=this.readObject();
			}
			
			return instance;
        }
        
        readDictionary(length:number){
			let weakKeys = this.readByte() != 0;
			
            var dic = {};
            
			this.objectsTable.push(dic);
			
			var key;
			var value;
			for(var i:number=0;i<length;i++){
				
				key = this.readObject();
				value = this.readObject();
				
				dic[key]=value
			}
			
			return dic;
		}

        readObject(){
			var value;
			var marker:number = this.readByte();
			switch(marker)
			{
				case AMF3Define.INT:
					value = this.readU29();
					break;
				
				case AMF3Define.DOUBLE:
					value = this.readDouble();
					break;
				
				case AMF3Define.FALSE:
				case AMF3Define.TRUE:
					value = (marker==AMF3Define.TRUE);
					break;
				
				case AMF3Define.NULL:
					value = null;
					break;
				
				case AMF3Define.UNDEFINED:
					value = undefined;
					break;
				
				
				case AMF3Define.STRING:
					value = this.readString();
					break;
				
				case AMF3Define.ARRAY:
				case AMF3Define.OBJECT:
				case AMF3Define.DATE:
				case AMF3Define.XML:
				case AMF3Define.XMLDOC:
				case AMF3Define.BYTEARRAY:
				case AMF3Define.OBJECTVECTOR:
				case AMF3Define.INTVECTOR:
				case AMF3Define.UINTVECTOR:
				case AMF3Define.DOUBLEVECTOR:
				case AMF3Define.DICTIONARY:
					value = this.readReferencableObject(marker);
					break;
				
				default :
					throw Error("not implement:"+marker);
					
			}
			
			return value;
        }

        
        
        private _readObject(handle:number):Object
		{
            const{traitsTable,objectsTable}=this;

			let traits:string[];
			let classDef:ClassDefine;
			let className:string;
			let len:number;
			let i:number;
			let inlineClassDef:Boolean = ((handle & 1) != 0);
			handle = handle >> 1;
			if( inlineClassDef)
			{
				
				className = this.readString();	
				let isIExternalizable = (handle&1) !=0;
				handle=handle>>1;
				let isDynamic = (handle&1) !=0;
				len=handle>>1;
				
				traits= [];
				for(i=0;i<len;i++){
					traits[i]=this.readString();
				}
				classDef=new ClassDefine(className,traits);
				classDef.isExternalizable=isIExternalizable;
				classDef.isDynamic=isDynamic;
				
				traitsTable.push(classDef);
			}else{
				classDef = traitsTable[handle];
				if(!classDef)
				{
					throw new Error("no trait found with refId: "+handle);
				}
				traits=classDef.members;
				className=classDef.className;
			}
			
            var instance;
            instance = {};
			
			objectsTable.push(instance);
			
            
            for(let key in traits){
                key = traits[key];
                instance[key]= this.readObject();
            }

			if(classDef.isDynamic){	
                let key;
				while(key = this.readString()){
					instance[key] = this.readObject();
				}
			}
			
			return instance;
		}
        readReferencableObject(marker:number)
		{
            const{objectsTable}=this;
			let object;
			let handle = this.readU29();
			let isIn = (handle&1) == 0;
			handle=handle>>1;
			
			if( isIn)
			{
				object = objectsTable[handle];
				return object;
			}
			else
			{
				switch(marker)
				{
					case AMF3Define.ARRAY:
						object = this.readArray(handle);
						break;
					
					case AMF3Define.OBJECT:
						object = this._readObject(handle);
						break;
					
					case AMF3Define.DATE:
						object = this.readDate(handle);
						break;
					
					case AMF3Define.XML:
						object = this.readMultiByte(handle);
						break;
					
					case AMF3Define.XMLDOC:
						object = this.readMultiByte(handle);
						break;
					case AMF3Define.BYTEARRAY:
						object = this.readByteArray(handle);
						break;
					case AMF3Define.OBJECTVECTOR :
					case AMF3Define.UINTVECTOR:
					case AMF3Define.INTVECTOR:
					case AMF3Define.DOUBLEVECTOR:
						object = this.readObjectVector(handle);
						break;
					case AMF3Define.DICTIONARY :
						object = this.readDictionary(handle);
						break;
					
					default :
						throw Error("not implement:"+handle);
				}
				
			}
			return object;
			
		}
    }


    // export class AMF3Test{
    //     load(url:string){
    //         loadRes(url,this.loadComplete,this,ResType.bin);
    //     }
    //     loadComplete(e:EventX):void{
    //         let item:ResItem = e.data;
            
    //         var amf = new AMF3(item.data);
    //         let o = amf.readObject();
    //     }
    // }

}