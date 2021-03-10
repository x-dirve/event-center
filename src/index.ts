import { isFunction, isNumber, isArray, copy, each } from "@x-drive/utils";

/**传递给处理函数的参数对象 */
type EventHandlerParam = {
    /**数据对象 */
    data: any;
}

/**处理函数对象 */
type EventSubscribe = {
    /**从哪个实例发出来的，暂时没用 */
    from?: string;

    /**消息处理函数 */
    handler: EventHandler;
}

/**事件订阅队列 */
type EventSubscribeSubject = {
    name?: EventSubscribe[];
}

interface EventHandler extends Function {
    /**订阅函数 id */
    eventId?: number;

    /**订阅消息处理函数，返回 false 阻止队列继续执行 */
    (re?: EventHandlerParam):boolean|void;
}

class EventCenter {

    /**订阅函数 id */
    private EID = 1;

    /**已注册的事件 */
    private events: EventSubscribeSubject = {};

    /**
     * 触发事件
     * @param subscribes 触发事件对应的订阅队列
     * @param data       需要传递给订阅函数的数据
     */
    private fire(subscribes: EventSubscribe[], data: any) {
        if (isArray(subscribes)) {
            each(subscribes, function (item: EventSubscribe) {
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
    on(name: string, handler: EventHandler) {
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
    off(name: string, handler?: Function | number) {
        if (this.events[name]) {
            if (handler) {
                let events: EventSubscribe[] = this.events[name];
                for (let i = 0; i < events.length; i++) {
                    if (
                        (isFunction(handler) && handler === events[i].handler)
                        || (isNumber(handler) && handler === events[i].handler.eventId)
                    ) {
                        events.splice(i, 1);
                        break;
                    }
                }
            } else {
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
    emit(name: string, data?: any) {
        if (this.events[name]) {
            this.fire(
                this.events[name]
                , data
            );
        }
    }

}

export { EventCenter };

const GlobalEventCenter = new EventCenter();
export default GlobalEventCenter;