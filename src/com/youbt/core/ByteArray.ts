///<reference path="./CONFIG.ts" />
namespace rf {
    export class Endian {
        public static LITTLE_ENDIAN:boolean = true;
        public static BIG_ENDIAN:boolean = false;
    }

    const enum ByteArraySize {
        SIZE_OF_BOOLEAN = 1,
        SIZE_OF_INT8 = 1,
        SIZE_OF_INT16 = 2,
        SIZE_OF_INT32 = 4,
        SIZE_OF_UINT8 = 1,
        SIZE_OF_UINT16 = 2,
        SIZE_OF_UINT32 = 4,
        SIZE_OF_FLOAT32 = 4,
        SIZE_OF_FLOAT64 = 8,
        SIZE_OF_FIX64 = 8,
        SIZE_OF_INT64 = 8,
        SIZE_OF_DOUBLE = 8,
        SIZE_OF_FLOAT = 4,
        SIZE_OF_FIX32 = 4,
        SIZE_OF_SFIX32 = 4,
    }
    export class ByteArray {
        protected bufferExtSize = 0;//Buffer expansion size
        protected data: DataView;
        protected _bytes: Uint8Array;
        protected _position: number;
        protected write_position: number;

        public endian:boolean = true;

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize = 0) {
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this.bufferExtSize = bufferExtSize;
            let bytes: Uint8Array, wpos = 0;
            if (buffer) {//有数据，则可写字节数从字节尾开始
                let uint8: Uint8Array;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                } else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                if (bufferExtSize == 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    let multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
            } else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this.write_position = wpos;
            this._position = 0;
            this._bytes = bytes;
            this.data = new DataView(bytes.buffer);
            this.endian = Endian.BIG_ENDIAN;
        }


        
        public setArrayBuffer(buffer: ArrayBuffer): void {

        }

        /**
         * 可读的剩余字节数
         * 
         * @returns 
         * 
         * @memberOf ByteArray
         */
        public get readAvailable() {
            return this.write_position - this._position;
        }

        public get buffer(): ArrayBuffer {
            return this.data.buffer.slice(0, this.write_position);
        }

        public get rawBuffer(): ArrayBuffer {
            return this.data.buffer;
        }

        /**
         * @private
         */
        public set buffer(value: ArrayBuffer) {
            let wpos = value.byteLength;
            let uint8 = new Uint8Array(value);
            let bufferExtSize = this.bufferExtSize;
            let bytes: Uint8Array;
            if (bufferExtSize == 0) {
                bytes = new Uint8Array(wpos);
            }
            else {
                let multi = (wpos / bufferExtSize | 0) + 1;
                bytes = new Uint8Array(multi * bufferExtSize);
            }
            bytes.set(uint8);
            this.write_position = wpos;
            this._bytes = bytes;
            this.data = new DataView(bytes.buffer);
        }

        public get bytes(): Uint8Array {
            return this._bytes;
        }

        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get dataView(): DataView {
            return this.data;
        }

        /**
         * @private
         */
        public set dataView(value: DataView) {
            this.buffer = value.buffer;
        }

        /**
         * @private
         */
        public get bufferOffset(): number {
            return this.data.byteOffset;
        }

        /**
         * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get position(): number {
            return this._position;
        }

        public set position(value: number) {
            this._position = value;
            if (value > this.write_position) {
                this.write_position = value;
            }
        }

        /**
         * The length of the ByteArray object (in bytes).
                  * If the length is set to be larger than the current length, the right-side zero padding byte array.
                  * If the length is set smaller than the current length, the byte array is truncated.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ByteArray 对象的长度（以字节为单位）。
         * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
         * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get length(): number {
            return this.write_position;
        }

        public set length(value: number) {
            this.write_position = value;
            if (this.data.byteLength > value) {
                this._position = value;
            }
            this._validateBuffer(value);
        }

        protected _validateBuffer(value: number) {
            if (this.data.byteLength < value) {
                let be = this.bufferExtSize;
                let tmp: Uint8Array;
                if (be == 0) {
                    tmp = new Uint8Array(value);
                }
                else {
                    let nLen = ((value / be >> 0) + 1) * be;
                    tmp = new Uint8Array(nLen);
                }
                tmp.set(this._bytes);
                this._bytes = tmp;
                this.data = new DataView(tmp.buffer);
            }
        }

        /**
         * The number of bytes that can be read from the current position of the byte array to the end of the array data.
         * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get bytesAvailable(): number {
            return this.data.byteLength - this._position;
        }

        /**
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public clear(): void {
            let buffer = new ArrayBuffer(this.bufferExtSize);
            this.data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this.write_position = 0;
        }

        /**
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readBoolean(): boolean {
            if (this.validate(ByteArraySize.SIZE_OF_BOOLEAN)) return !!this._bytes[this.position++];
        }

        /**
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT8)) return this.data.getInt8(this.position++);
        }

        /**
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            if (!bytes) {//由于bytes不返回，所以new新的无意义
                return;
            }
            let pos = this._position;
            let available = this.write_position - pos;
            if (available < 0) {
                // egret.$error(1025);
                return;
            }
            if (length == 0) {
                length = available;
            }
            else if (length > available) {
                // egret.$error(1025);
                return;
            }
            const position = bytes._position;
            bytes._position = 0;
            bytes.validateBuffer(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        }

        /**
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readDouble(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT64)) {
                let value = this.data.getFloat64(this._position, this.endian);
                this.position += ByteArraySize.SIZE_OF_FLOAT64;
                return value;
            }
        }

        /**
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readFloat(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT32)) {
                let value = this.data.getFloat32(this._position, this.endian);
                this.position += ByteArraySize.SIZE_OF_FLOAT32;
                return value;
            }
        }

        /**
         * Read a 32-bit signed integer from the byte stream.
         * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT32)) {
                let value = this.data.getInt32(this._position, this.endian);
                this.position += ByteArraySize.SIZE_OF_INT32;
                return value;
            }
        }

        /**
         * Read a 16-bit signed integer from the byte stream.
         * @return A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT16)) {
                let value = this.data.getInt16(this._position, this.endian);
                this.position += ByteArraySize.SIZE_OF_INT16;
                return value;
            }
        }

        /**
         * Read unsigned bytes from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUnsignedByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT8)) return this._bytes[this.position++];
        }

        /**
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUnsignedInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT32)) {
                let value = this.data.getUint32(this._position, this.endian);
                this.position += ByteArraySize.SIZE_OF_UINT32;
                return value;
            }
        }

        /**
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUnsignedShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT16)) {
                let value = this.data.getUint16(this._position, this.endian);
                this.position += ByteArraySize.SIZE_OF_UINT16;
                return value;
            }
        }

        /**
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUTF(): string {
            let length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            } else {
                return "";
            }
        }

        /**
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUTFBytes(length: number): string {
            if (!this.validate(length)) {
                return;
            }
            let data = this.data;
            let bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        }

        /**
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeBoolean(value: boolean): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_BOOLEAN);
            this._bytes[this.position++] = +value;
        }

        /**
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeByte(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT8);
            this._bytes[this.position++] = value & 0xff;
        }

        /**
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            let writeLength: number;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            } else if (length == 0) {
                writeLength = bytes.length - offset;
            } else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        }

        /**
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeDouble(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_FLOAT64);
            this.data.setFloat64(this._position, value, this.endian);
            this.position += ByteArraySize.SIZE_OF_FLOAT64;
        }

        /**
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeFloat(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_FLOAT32);
            this.data.setFloat32(this._position, value, this.endian);
            this.position += ByteArraySize.SIZE_OF_FLOAT32;
        }

        /**
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeInt(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT32);
            this.data.setInt32(this._position, value, this.endian);
            this.position += ByteArraySize.SIZE_OF_INT32;
        }

        /**
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeShort(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT16);
            this.data.setInt16(this._position, value, this.endian);
            this.position += ByteArraySize.SIZE_OF_INT16;
        }

        /**
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUnsignedInt(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_UINT32);
            this.data.setUint32(this._position, value, this.endian);
            this.position += ByteArraySize.SIZE_OF_UINT32;
        }

        /**
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUnsignedShort(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_UINT16);
            this.data.setUint16(this._position, value, this.endian);
            this.position += ByteArraySize.SIZE_OF_UINT16;
        }

        /**
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUTF(value: string): void {
            let utf8bytes: ArrayLike<number> = this.encodeUTF8(value);
            let length: number = utf8bytes.length;
            this.validateBuffer(ByteArraySize.SIZE_OF_UINT16 + length);
            this.data.setUint16(this._position, length, this.endian);
            this.position += ByteArraySize.SIZE_OF_UINT16;
            this._writeUint8Array(utf8bytes, false);
        }

        /**
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUTFBytes(value: string): void {
            this._writeUint8Array(this.encodeUTF8(value));
        }


        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        public toString(): string {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        }

        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        public _writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer: boolean = true): void {
            let pos = this._position;
            let npos = pos + bytes.length;
            if (validateBuffer) {
                this.validateBuffer(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        }

        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        public validate(len: number): boolean {
            let bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            } else {
                // egret.$error(1025);
            }
        }

        /**********************/
        /*  PRIVATE METHODS   */
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        protected validateBuffer(len: number): void {
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            this._validateBuffer(len);
        }

        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        private encodeUTF8(str: string): Uint8Array {
            let pos: number = 0;
            let codePoints = this.stringToCodePoints(str);
            let outputBytes = [];

            while (codePoints.length > pos) {
                let code_point: number = codePoints[pos++];

                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    this.encoderError(code_point);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                } else {
                    let count, offset;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    } else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    } else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }

                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);

                    while (count > 0) {
                        let temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        }

        /**
         * @private
         *
         * @param data
         * @returns
         */
        private decodeUTF8(data: Uint8Array): string {
            let fatal: boolean = false;
            let pos: number = 0;
            let result: string = "";
            let code_point: number;
            let utf8_code_point = 0;
            let utf8_bytes_needed = 0;
            let utf8_bytes_seen = 0;
            let utf8_lower_boundary = 0;

            while (data.length > pos) {

                let _byte = data[pos++];

                if (_byte == this.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    } else {
                        code_point = this.EOF_code_point;
                    }
                } else {

                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        } else {
                            if (this.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            } else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            } else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            } else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    } else if (!this.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, _byte);
                    } else {

                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);

                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        } else {

                            let cp = utf8_code_point;
                            let lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            } else {
                                code_point = this.decoderError(fatal, _byte);
                            }
                        }

                    }
                }
                //Decode string
                if (code_point !== null && code_point !== this.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0) result += String.fromCharCode(code_point);
                    } else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        }

        /**
         * @private
         *
         * @param code_point
         */
        private encoderError(code_point) {
            // egret.$error(1026, code_point);
        }

        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        private decoderError(fatal, opt_code_point?): number {
            if (fatal) {
                // egret.$error(1027);
            }
            return opt_code_point || 0xFFFD;
        }

        /**
         * @private
         */
        private EOF_byte: number = -1;
        /**
         * @private
         */
        private EOF_code_point: number = -1;

        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        private inRange(a, min, max) {
            return min <= a && a <= max;
        }

        /**
         * @private
         *
         * @param n
         * @param d
         */
        private div(n, d) {
            return Math.floor(n / d);
        }

        /**
         * @private
         *
         * @param string
         */
        private stringToCodePoints(string) {
            /** @type {Array.<number>} */
            let cps = [];
            // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
            let i = 0, n = string.length;
            while (i < string.length) {
                let c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                } else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                } else { // (inRange(c, 0xD800, 0xDBFF))
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    } else {
                        let d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            let a = c & 0x3FF;
                            let b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        } else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        }

        /**
         * 替换缓冲区
         * 
         * @param {ArrayBuffer} value 
         */
        public replaceBuffer(value: ArrayBuffer) {
            this.write_position = value.byteLength;
            this._bytes = new Uint8Array(value);
            this.data = new DataView(value);
        }

        /**
         * 
         * 读取指定长度的Buffer
         * @param {number} length       指定的长度
         * @returns {Buffer}
         */
        public readBuffer(length: number): ArrayBuffer {
            if (!this.validate(length)) return;
            let start = this.position;
            this.position += length;
            return this.buffer.slice(start, this.position);
        }

        public readInt64() {
            if (this.validate(ByteArraySize.SIZE_OF_INT64)) {
                let low: number, high: number;
                let flag = this.endian == Endian.LITTLE_ENDIAN;
                let data = this.data;
                let pos = this._position;
                if (flag) {
                    low = data.getUint32(pos, flag);
                    high = data.getUint32(pos + ByteArraySize.SIZE_OF_UINT32, flag);
                } else {
                    high = data.getUint32(pos, flag);
                    low = data.getUint32(pos + ByteArraySize.SIZE_OF_UINT32, flag);
                }
                this.position = pos + ByteArraySize.SIZE_OF_INT64;
                return Int64.toNumber(low, high);
            }
        }

        public writeInt64(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT64);
            let i64 = Int64.fromNumber(value);
            let { high, low } = i64;
            let flag = this.endian == Endian.LITTLE_ENDIAN;
            let data = this.data;
            let pos = this._position;
            if (flag) {
                data.setUint32(pos, low, flag);
                data.setUint32(pos + ByteArraySize.SIZE_OF_UINT32, high, flag);
            } else {
                data.setUint32(pos, high, flag);
                data.setUint32(pos + ByteArraySize.SIZE_OF_UINT32, low, flag);
            }
            this.position = pos + ByteArraySize.SIZE_OF_INT64;
        }

        /**
         * 读取ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        public readPBDouble() {
            if (this.validate(ByteArraySize.SIZE_OF_DOUBLE)) {
                let value = this.data.getFloat64(this._position, true);
                this.position += ByteArraySize.SIZE_OF_DOUBLE;
                return value;
            }
        }

        /**
         * 写入ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         * @param value 
         */
        public writePBDouble(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_DOUBLE);
            this.data.setFloat64(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_DOUBLE;
        }

        /**
         * 读取ProtoBuf的`Float`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        public readPBFloat() {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT)) {
                let value = this.data.getFloat32(this._position, true);
                this.position += ByteArraySize.SIZE_OF_FLOAT;
                return value;
            }
        }

        /**
          * 写入ProtoBuf的`Float`
          * protobuf封装是使用littleEndian的，不受Endian影响
          * @param value 
          */
        public writePBFloat(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_FLOAT);
            this.data.setFloat32(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_FLOAT;
        }

        public readFix32() {
            if (this.validate(ByteArraySize.SIZE_OF_FIX32)) {
                let value = this.data.getUint32(this._position, true);
                this.position += ByteArraySize.SIZE_OF_UINT32;
                return value;
            }
        }

        public writeFix32(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_FIX32);
            this.data.setUint32(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_FIX32;
        }

        public readSFix32() {
            if (this.validate(ByteArraySize.SIZE_OF_SFIX32)) {
                let value = this.data.getInt32(this._position, true);
                this.position += ByteArraySize.SIZE_OF_SFIX32;
                return value;
            }
        }

        public writeSFix32(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_SFIX32);
            this.data.setInt32(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_SFIX32;
        }

        public readFix64() {
            if (this.validate(ByteArraySize.SIZE_OF_FIX64)) {
                let pos = this._position;
                let data = this.data;
                let low = data.getUint32(pos, true);
                let high = data.getUint32(pos + ByteArraySize.SIZE_OF_UINT32, true);
                this.position = pos + ByteArraySize.SIZE_OF_FIX64;
                return Int64.toNumber(low, high);
            }
        }

        public writeFix64(value: number) {
            let i64 = Int64.fromNumber(value);
            this.validateBuffer(ByteArraySize.SIZE_OF_FIX64);
            let pos = this._position;
            let data = this.data;
            data.setUint32(pos, i64.low, true);
            data.setUint32(pos + ByteArraySize.SIZE_OF_UINT32, i64.high, true);
            this.position = pos + ByteArraySize.SIZE_OF_FIX64;
        }

        /**
         * 
         * 读取指定长度的ByteArray
         * @param {number} length       指定的长度
         * @param {number} [ext=0]      ByteArray扩展长度参数
         * @returns {ByteArray}
         */
        public readByteArray(length: number, ext = 0): ByteArray {
            let ba = new ByteArray(this.readBuffer(length), ext);
            ba.endian = this.endian;
            return ba;
        }
		/**
		 * 向字节流中写入64位的可变长度的整数(Protobuf)
		 */
        public writeVarint64(value: number): void {
            let i64 = Int64.fromNumber(value);
            var high = i64.high;
            var low = i64.low;
            if (high == 0) {
                this.writeVarint(low);
            }
            else {
                for (var i: number = 0; i < 4; ++i) {
                    this.writeByte((low & 0x7F) | 0x80);
                    low >>>= 7;
                }
                if ((high & (0xFFFFFFF << 3)) == 0) {
                    this.writeByte((high << 4) | low);
                }
                else {
                    this.writeByte((((high << 4) | low) & 0x7F) | 0x80);
                    this.writeVarint(high >>> 3);
                }
            }
        }

        /**
		 * 向字节流中写入32位的可变长度的整数(Protobuf)
		 */
        public writeVarint(value: number): void {
            for (; ;) {
                if (value < 0x80) {
                    this.writeByte(value);
                    return;
                }
                else {
                    this.writeByte((value & 0x7F) | 0x80);
                    value >>>= 7;
                }
            }
        }

        /**
         * 读取字节流中的32位变长整数(Protobuf)
         */
        public readVarint(): number {
            var result = 0
            for (var i = 0; ; i += 7) {
                if (i < 32) {
                    let b = this.readUnsignedByte();
                    if (b >= 0x80) {
                        result |= ((b & 0x7f) << i);
                    }
                    else {
                        result |= (b << i);
                        break
                    }
                } else {
                    while (this.readUnsignedByte() >= 0x80) { }
                    break
                }
            }
            return result;
        }

        /**
          * 读取字节流中的32位变长整数(Protobuf)
          */
        public readVarint64(): number {
            let b: number, low: number, high: number, i = 0;
            for (; ; i += 7) {
                b = this.readUnsignedByte();
                if (i == 28) {
                    break;
                }
                else {
                    if (b >= 0x80) {
                        low |= ((b & 0x7f) << i);
                    }
                    else {
                        low |= (b << i);
                        return Int64.toNumber(low, high);
                    }
                }
            }
            if (b >= 0x80) {
                b &= 0x7f;
                low |= (b << i);
                high = b >>> 4;
            }
            else {
                low |= (b << i);
                high = b >>> 4;
                return Int64.toNumber(low, high);
            }
            for (i = 3; ; i += 7) {
                b = this.readUnsignedByte();
                if (i < 32) {
                    if (b >= 0x80) {
                        high |= ((b & 0x7f) << i);
                    }
                    else {
                        high |= (b << i);
                        break
                    }
                }
            }
            return Int64.toNumber(low, high);
        }

        /**
         * 获取写入的字节
         * 此方法不会新建 ArrayBuffer
         * @readonly
         * @memberof ByteArray
         */
        public get outBytes() {
            return new Uint8Array(this._bytes.buffer, 0, this.write_position);
        }

        /**
         * 重置索引
         * 
         * @memberof ByteArray
         */
        public reset() {
            this.write_position = this.position = 0;
        }
    }




    /**
	 * 项目中不使用long类型，此值暂时只用于存储Protobuff中的int64 sint64
	 * @author 
	 *
	 */
	export class Int64 {
		/**
		 * 高位
		 */
		public high: number;
		/**
		 * 低位
		 */
		public low: number;

		public constructor(low?: number, high?: number) {
			this.low = low | 0;
			this.high = high | 0;
		}

		public toNumber() {
			return this.high * _2_32 + (this.low >>> 0);
		}

		public static toNumber(low?: number, high?: number) {
			return (high | 0) * _2_32 + (low >>> 0);
		}

		public static fromNumber(value: number) {
			if (isNaN(value) || !isFinite(value)) {
				return ZERO;
			}

			if (value <= -_2_63) {
				return MIN_VALUE;
			}
			if (value + 1 >= _2_63) {
				return MAX_VALUE;
			}

			if (value < 0) {
				let v = Int64.fromNumber(-value);
				if (v.high === MIN_VALUE.high && v.low === MIN_VALUE.low) {
					return MIN_VALUE;
				}
				v.low = ~v.low;
				v.high = ~v.high;
				return v.add(ONE);
			}
			else {
				return new Int64((value % _2_32) | 0, (value / _2_32) | 0);
			}
		}

		public add(addend: Int64) {
			var a48 = this.high >>> 16;
			var a32 = this.high & 0xFFFF;
			var a16 = this.low >>> 16;
			var a00 = this.low & 0xFFFF;

			var b48 = addend.high >>> 16;
			var b32 = addend.high & 0xFFFF;
			var b16 = addend.low >>> 16;
			var b00 = addend.low & 0xFFFF;

			var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
			c00 += a00 + b00;
			c16 += c00 >>> 16;
			c00 &= 0xFFFF;
			c16 += a16 + b16;
			c32 += c16 >>> 16;
			c16 &= 0xFFFF;
			c32 += a32 + b32;
			c48 += c32 >>> 16;
			c32 &= 0xFFFF;
			c48 += a48 + b48;
			c48 &= 0xFFFF;
			return new Int64((c16 << 16) | c00, (c48 << 16) | c32);
		}
	}

	/**
	 * 2的16次方
	 */
	const _2_16 = 1 << 16;
	/**
	 * 2的32次方
	 */
	const _2_32 = _2_16 * _2_16;
	/**
	 * 2的64次方
	 */
	const _2_64 = _2_32 * _2_32;
	/**
	 * 2的63次方
	 */
	const _2_63 = _2_64 / 2;

	const ZERO = new Int64();
	const MAX_VALUE = new Int64(-1, 0x7FFFFFFF);
	const MIN_VALUE = new Int64(0, -2147483648);
	const ONE = new Int64(1);
}
