module rf{


	export class Dictionary<Key , Value> {


		public constructor() {
			this._keys = [];
			this._values = [];
			this._size = 0;
		}



		private _keys:Key[] ;
		private _values:Value[] ;

		private _size:number;


		public set(key:Key , value:Value): Dictionary<Key , Value> {
			var keys = this._keys;
			var idx = keys.indexOf(key) ;
			if (~idx) {// idx != -1  覆盖values数组的数据
				this._values[idx] = value;
			} else {//idx == -1 新增
				var size = this._size;
				keys[size] = key;
				this._values[size] = value;
				this._size++;
			}
			return this;
		}

		public get(key: Key): Value {
			var idx = this._keys.indexOf(key);
			if (~idx) {
				return this._values[idx];
			}
			return null;
		}

		public has(key: Key): boolean {
			return !!~this._keys.indexOf(key);
		}

		public delete(key: Key): boolean {
			var keys = this._keys;
			var idx = keys.indexOf(key);
			if (~idx) {//有索引，干掉key和value
				keys.splice(idx, 1);
				this._values.splice(idx, 1);
				this._size--;
				return true;
			}
			return false;
		}

		public forEach(callbackfn: (value: Value, key: Key , dictionary: Dictionary<Key , Value>) => void , thisArg?: any) {
			var keys = this._keys;
			var values = this._values;

			for (let i = 0 ; i < this._size ; i++) {
				let len = this._size ;

				callbackfn(values[i], keys[i], <Dictionary<Key , Value>>thisArg);
				
				if(this._size < len){
					i -- ;
				}

			}
		}

		public clear() {
			this._keys.length = 0;
			this._values.length = 0;
			this._size = 0;
		}

		public get size(): number {
			return this._size;
		}


		public get values():Value[]{
			return this._values ;
		}
		
		public get keys():Key[]{
			return this._keys ;
		}



	}
}