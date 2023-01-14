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

test("Test cancellable timeouts", async ()=>{
    let arr = new Int32Array(new SharedArrayBuffer(4));
    const ms = 100; // interval ms
    const reasonable_delay = 20; // Reasonable delay in ms

    expect(Atomics.load(arr, 0)).toBe(0);
    let myTimeout = prcTimeout(ms, () => {
        Atomics.add(arr, 0, 1);
    });
    let myTimeout2 = prcTimeoutWithDelta(ms, () => {
        Atomics.add(arr, 0, 1);
    });
    expect(Atomics.load(arr, 0)).toBe(0);
    myTimeout.cancel();
    myTimeout2.cancel();
    for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, ms+reasonable_delay));
        expect(Atomics.load(arr, 0)).toBe(0);
    }
});


test("Test interval",
    async () => {
        let arr = new Int32Array( new SharedArrayBuffer(4) ); // 4bytes int32 = 1 element
        expect(Atomics.load(arr, 0)).toBe(0);

        const ms = 100; // interval ms
        const reasonable_delay = 35; // Reasonable delay in ms
        const increase = () => Atomics.add(arr, 0, 1);
        let intervalConfig = prcInterval(ms, increase);
        expect(intervalConfig.getPeriod()).toBe(ms);

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
        intervalConfig.cancel();
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
        expect(intervalConfig.getPeriod()).toBe(ms);

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
        intervalConfig.cancel();
        await new Promise((r) => setTimeout(r, 200));
    }
);

test("Immediately end interval without tick", async ()=>{
    let x = 0;
    let intervalController = prcInterval(500, ()=>x++);
    intervalController.cancel();
    intervalController = prcIntervalWithDelta(500, ()=>x++);
    intervalController.cancel();
    await new Promise((r) => setTimeout(r, 1000));
    expect(x).toBe(0);
});

test("Restart interval just before executing", async ()=>{
    let x = 0;
    let intervalController = prcInterval(500, ()=> x++);
    let intervalController2 = prcIntervalWithDelta(500, ()=> x++);
    await new Promise((r) => setTimeout(r, 400));
    intervalController.restart();
    intervalController2.restart();
    await new Promise((r) => setTimeout(r, 150));
    expect(x).toBe(0);
    await new Promise((r) => setTimeout(r, 550));
    expect(x).toBe(2);
    intervalController.cancel();
    intervalController2.cancel();
    await new Promise((r) => setTimeout(r, 200));
});

test("Flex period intervals", async()=>{
    let x = 0;
    let intervalController = prcInterval(400, ()=> x++);
    let intervalController2 = prcIntervalWithDelta(400, ()=> x++);
    await new Promise((r) => setTimeout(r, 10));
    expect(x).toBe(0);
    intervalController.setPeriod(200);
    intervalController2.setPeriod(200);
    await new Promise((r) => setTimeout(r, 450));
    expect(x).toBe(4);
    intervalController.cancel();
    intervalController2.cancel();
    await new Promise((r) => setTimeout(r, 200));
});

test("Pause/resume intervals", async ()=>{
    let x = 0;
    let intervalController = prcInterval(50, ()=> x++);
    intervalController.pauseResume();
    let intervalController2 = prcIntervalWithDelta(50, ()=> x++);
    intervalController2.pauseResume();

    await new Promise((r) => setTimeout(r, 100));
    expect(x).toBe(0);

    intervalController.pauseResume();
    intervalController2.pauseResume();
    
    await new Promise((r) => setTimeout(r, 120));
    expect(x).toBe(4);

    intervalController.cancel();
    intervalController2.cancel();
    await new Promise((r) => setTimeout(r, 200));
});