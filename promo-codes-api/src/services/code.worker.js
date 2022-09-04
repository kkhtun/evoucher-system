const {
    Worker,
    isMainThread,
    parentPort,
    workerData,
} = require("node:worker_threads");

if (isMainThread) {
    module.exports = function generatePromoCodeWorker(data) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: data,
            });
            worker.on("message", resolve);
            worker.on("error", reject);
            worker.on("exit", (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    };
} else {
    // generation here
    function generateNewCode() {
        const alphabets = "abcdefghijklmnopqrstuvwxyz";
        const digits = "0123456789";

        let digitString = "";
        for (let i = 0; i < 6; i++) {
            digitString += digits.charAt(
                Math.floor(Math.random() * digits.length)
            );
        }
        let alphabetString = "";
        for (let j = 0; j < 5; j++) {
            alphabetString += alphabets.charAt(
                Math.floor(Math.random() * alphabets.length)
            );
        }
        return digitString + alphabetString;
    }

    const { quantity } = workerData;
    let i = 0;
    let codes = [];
    let map = new Map();
    while (i < quantity) {
        let code = generateNewCode();
        if (map.has(code)) continue;
        codes.push(code);
        map.set(code, true);
        i++;
    }
    parentPort.postMessage(codes);
}
