# 消息模块

> 简单的消息订阅模块，用于一些简单的场景

## 订阅
订阅一个事件，返回订阅函数 id，使用该 id 可以在不传入原有订阅函数的情况下取消事件订阅
```ts
on(name: string, handler: EventHandler): number;
```
- `name` 事件名称
- `handler` 处理函数

## 取消订阅
传入指定的 id 或函数取消某个订阅或不传入任何指定内容取消所有订阅
```ts
off(name: string, handler?: Function | number): void;
```
- `name` 事件名称
- `handler` 处理函数或要去掉的订阅函数 id

## 触发
触发一个指定订阅事件，可选择向所有的订阅函数传递数据
```ts
emit(name: string, data?: any): void;
```
- `name` 事件名称
- `data` 事件数据
