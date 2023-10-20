
type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer P> ? P : never;
