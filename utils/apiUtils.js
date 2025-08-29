"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequest = getRequest;
exports.postRequest = postRequest;
exports.putRequest = putRequest;
exports.deleteRequest = deleteRequest;
function getRequest(context, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield context.get(url);
        if (!response.ok()) {
            throw new Error(`GET request failed: ${response.status()} ${response.statusText()}`);
        }
        return response.json();
    });
}
function postRequest(context, url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield context.post(url, {
            data,
        });
        if (!response.ok()) {
            throw new Error(`POST request failed: ${response.status()} ${response.statusText()}`);
        }
        return response.json();
    });
}
function putRequest(context, url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield context.put(url, {
            data,
        });
        if (!response.ok()) {
            throw new Error(`PUT request failed: ${response.status()} ${response.statusText()}`);
        }
        return response.json();
    });
}
function deleteRequest(context, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield context.delete(url);
        if (!response.ok()) {
            throw new Error(`DELETE request failed: ${response.status()} ${response.statusText()}`);
        }
        return response.json();
    });
}
