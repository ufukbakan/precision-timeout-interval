const { prcTimeout, prcInterval, prcTimeoutWithDelta, prcIntervalWithDelta } = require(".");
jest.setTimeout(10000);

test("Test timeout",
    async () => {
        let arr = new Int32Array(new SharedArrayBuffer(4));
        const ms = 100; // interval ms
        const reasonable_delay = 20; // Reasonable delay in ms
        prcTimeout(ms, () => {
            Atomics.add(arr, 0, 1);
        });
        expect(Atomics.load(arr, 0)).toBe(0);
        for (let i = 0; i < 5; i++) {
            await new Promise((r) => setTimeout(r, ms+reasonable_delay));
            expect(Atomics.load(arr, 0)).toBe(1);
        }
    }
);

test("Test timeout with delta",
    async () => {
        let arr = new Int32Array(new SharedArrayBuffer(4));
        const ms = 100; // interval ms
        const reasonable_delay = 20; // Reasonable delay in ms
        prcTimeoutWithDelta(ms, () => {
            Atomics.add(arr, 0, 1);
        });
        expect(Atomics.load(arr, 0)).toBe(0);
        for (let i = 0; i < 5; i++) {
            await new Promise((r) => setTimeout(r, ms+reasonable_delay));
            expect(Atomics.load(arr, 0)).toBe(1);
        }
    }
);


test("Test interval",
    async () => {
        let arr = new Int32Array( new SharedArrayBuffer(4) ); // 4bytes int32 = 1 element
        expect(Atomics.load(arr, 0)).toBe(0);

        const ms = 100; // interval ms
        const reasonable_delay = 35; // Reasonable delay in ms
        const increase = () => Atomics.add(arr, 0, 1);
        let intervalConfig = prcInterval(ms, increase);

        for (let i = 0; i < 5; i++) {
            const startTime = Date.now();
            let condition = false;
            while(Atomics.load(arr, 0) != i+1){
                await new Promise((r) => setTimeout(r, 5));
            }
            const endTime = Date.now();
            expect( Atomics.load(arr, 0) ).toBe(i+1);
            expect(endTime - startTime).toBeLessThanOrEqual(ms+reasonable_delay);
        }
        intervalConfig.end = true;
        await new Promise((r) => setTimeout(r, 200));
    }
);


test("Test interval with delta",
    async () => {
        let arr = new Int32Array( new SharedArrayBuffer(4) ); // 4bytes int32 = 1 element
        expect(Atomics.load(arr, 0)).toBe(0);

        const ms = 100; // interval ms
        const reasonable_delay = 35; // Reasonable delay in ms
        const increase = () => Atomics.add(arr, 0, 1);
        let intervalConfig = prcIntervalWithDelta(ms, increase);

        for (let i = 0; i < 5; i++) {
            const startTime = Date.now();
            let condition = false;
            while(Atomics.load(arr, 0) != i+1){
                await new Promise((r) => setTimeout(r, 5));
            }
            const endTime = Date.now();
            expect( Atomics.load(arr, 0) ).toBe(i+1);
            expect(endTime - startTime).toBeLessThanOrEqual(ms+reasonable_delay);
        }
        intervalConfig.end = true;
        await new Promise((r) => setTimeout(r, 200));
    }
);