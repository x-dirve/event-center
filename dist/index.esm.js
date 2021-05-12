/**
 * 数据类型判断
 * @param  subject 待判断的数据
 * @param  type    数据类型名字
 * @return         判断结果
 */
function is(subject, type) {
    return Object.prototype.toString.call(subject).substr(8, type.length).toLowerCase() === type;
}

/**
 * 是否是数组
 * @param  subject 待判断的数据
 */
function isObject(subject) {
    return is(subject, "object");
}

/**
 * 是否 undefined
 * @param  subject 待判断的数据
 */
function isUndefined(subject) {
    return is(subject, "undefined");
}

/**
 * 是否是函数
 * @param  subject 待判断的数据
 */
function isFunction(subject) {
    return is(subject, "function");
}

/**
 * 是否是数组
 * @param  subject 待判断的数据
 */
function isArray(subject) {
    return Array.isArray(subject);
}

/**
 * 通用遍历函数
 * @param  data    待遍历数据
 * @param  handler 处理函数
 * @param  context 作用域
 */
function each(data, handler, context) {
    context = context || this;
    var hasHandler = isFunction(handler);
    if (isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            var re = true;
            if (hasHandler) {
                re = handler.call(context, data[i], i);
            }
            if (re === false) {
                break;
            }
        }
    }
    else if (isObject(data)) {
        var keys = Object.keys(data);
        for (var i$1 = 0; i$1 < keys.length; i$1++) {
            var re$1 = true;
            if (hasHandler) {
                re$1 = handler.call(context, data[keys[i$1]], keys[i$1]);
            }
            if (re$1 === false) {
                break;
            }
        }
    }
}

/**
 * 简单复制
 * @param  item 原始数据
 * @return      复制后的数据
 */
function copy(item) {
    return JSON.parse(JSON.stringify(item));
}

/**
 * 是否是数字
 * @param  subject 待判断的数据
 */
function isNumber(subject) {
    return !isNaN(subject) && is(subject, "number");
}

class EventCenter {
    constructor() {
        /**订阅函数 id */
        this.EID = 1;
        /**已注册的事件 */
        this.events = {};
    }
    /**
     * 触发事件
     * @param subscribes 触发事件对应的订阅队列
     * @param data       需要传递给订阅函数的数据
     */
    fire(subscribes, data) {
        if (isArray(subscribes)) {
            if (isUndefined(data)) {
                data = null;
            }
            each(subscribes, function (item) {
                if (isFunction(item.handler)) {
                    return item.handler({
                        "data": copy(data)
                    });
                }
            }, this);
        }
    }
    /**
     * 订阅
     * @param name    事件名称
     * @param handler 处理函数
     * @returns       订阅函数 id，使用该 id 可以在不传入原有订阅函数的情况下取消事件订阅
     * @example
     * ```ts
     * const evHandler = ({ data }) => {
     *     console.log("test");
     *     console.log(data);
     * }
     * EventCenter.on("test", evHandler);
     * ```
     */
    on(name, handler) {
        if (name && isFunction(handler)) {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            var eventId = ++this.EID;
            handler.eventId = eventId;
            this.events[name].push({
                handler
            });
            return eventId;
        }
        return 0;
    }
    /**
     * 取消订阅
     * @param name    订阅事件名称
     * @param handler 处理函数或要去掉的订阅函数 id
     * @example
     * ```ts
     * // 传入指定的 id 或函数取消某个订阅
     * EventCenter.off("test", 123);
     * // 全部取消
     * EventCenter.off("test");
     * ```
     */
    off(name, handler) {
        if (this.events[name]) {
            if (handler) {
                let events = this.events[name];
                for (let i = 0; i < events.length; i++) {
                    if ((isFunction(handler) && handler === events[i].handler)
                        || (isNumber(handler) && handler === events[i].handler.eventId)) {
                        events.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                this.events[name] = [];
            }
        }
    }
    /**
     * 触发指定订阅事件
     * @param name 订阅事件名称
     * @param data 订阅事件数据
     * @example
     * ```ts
     * EventCenter.emit("test", "Nice");
     * ```
     */
    emit(name, data) {
        if (this.events[name]) {
            this.fire(this.events[name], data);
        }
    }
}
const GlobalEventCenter = new EventCenter();

export default GlobalEventCenter;
export { EventCenter };
//# sourceMappingURL=index.esm.js.map
