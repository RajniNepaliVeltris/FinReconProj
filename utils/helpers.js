"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBigCtoKibo = convertBigCtoKibo;
exports.delay = delay;
exports.generateRandomString = generateRandomString;
function convertBigCtoKibo(bigCData) {
    // Example conversion logic
    return {
        id: bigCData.productId,
        name: bigCData.productName,
        price: bigCData.productPrice,
    };
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
