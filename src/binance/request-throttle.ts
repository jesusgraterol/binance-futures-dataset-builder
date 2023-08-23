



/**
 * Request Throttle Decorator
 * Binance has strict request restrictions when interacting with their
 * public endpoints. The purpose of this decorator is to avoid getting
 * blacklisted by their middlewares.
 * @param seconds
 */
export const request_throttle = (seconds: number = 2) => {
    return (target: Object, property_key: string, descriptor: TypedPropertyDescriptor<(... params: any[])=> Promise<any>>) => {
        let original_func = descriptor.value!;
        descriptor.value = async function (...args) {
            await async_delay(seconds);
            let result = await original_func.apply(this, args);
            await async_delay(seconds);
            return result;
        }
    }
}
async function async_delay(seconds: number): Promise<void> { 
    return new Promise((resolve, reject) => { setTimeout(() => { resolve() }, seconds * 1000) });
}