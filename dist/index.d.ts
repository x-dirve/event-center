interface EventHandler extends Function {
    /**订阅函数 id */
    eventId?: number;
    /**订阅消息处理函数，返回 false 阻止队列继续执行 */
    (...re: any[]): boolean | void;
}
declare class EventCenter {
    /**订阅函数 id */
    private EID;
    /**已注册的事件 */
    private events;
    /**
     * 触发事件
     * @param subscribes 触发事件对应的订阅队列
     * @param data       需要传递给订阅函数的数据
     */
    private fire;
    /**
     * 订阅
     * @param name    事件名称
     * @param handler 处理函数
     * @returns       订阅函数 id，使用该 id 可以在不传入原有订阅函数的情况下取消事件订阅
     * @example
     * ```ts
     * EventCenter.on("test", (data) => {
     *     console.log("test");
     *     console.log(data);
     * });
     * ```
     */
    on(name: string, handler: EventHandler): number;
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
    off(name: string, handler?: Function | number): void;
    /**
     * 触发指定订阅事件
     * @param name 订阅事件名称
     * @param data 订阅事件数据
     * @example
     * ```ts
     * EventCenter.emit("test", "Nice");
     * EventCenter.emit("hello", "Nice", "To", "Meet", "U");
     * ```
     */
    emit(name: string, ...data: any[]): void;
}
export { EventCenter };
declare const GlobalEventCenter: EventCenter;
export default GlobalEventCenter;
