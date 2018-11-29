"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Creates a generic proxy backend
 * @param {string} origin The origin server to use (should be an ip, or resolve to a different IP)
 * @param {Object} [headers] Headers to pass to the origin server
 */
exports.generic = function (origin, headers) {
    return function genericFetch(req, basePath) {
        return proxy(req, origin, { basePath, headers });
    };
};

const backends = {
    generic: exports.generic
};

exports.default = backends;

function proxy(req, origin, opts) {
    const url = new URL(req.url);
    let breq = null;
    if (req instanceof Request) {
        breq = req.clone();
    }
    else {
        breq = new Request(req);
    }
    if (typeof origin === "string") {
        origin = new URL(origin);
    }
    url.hostname = origin.hostname;
    url.protocol = origin.protocol;
    url.port = origin.port;
    if (opts.basePath && typeof opts.basePath === 'string') {
        url.pathname = url.pathname.substring(opts.basePath.length);
        console.log("rewriting base path:", opts.basePath, url.pathname);
    }
    if (origin.pathname && origin.pathname.length > 0) {
        url.pathname = origin.pathname + url.pathname;
    }
    if (url.pathname.startsWith("//")) {
        url.pathname = url.pathname.substring(1);
    }
    breq.url = url.toString();
    // we extend req with remoteAddr
    breq.headers.set("x-forwarded-for", req.remoteAddr);
    breq.headers.set("x-forwarded-host", url.hostname);
    if (opts.headers && opts.headers instanceof Object) {
        for (const h of Object.getOwnPropertyNames(opts.headers)) {
            const v = opts.headers[h];
            if (v === false) {
                breq.headers.delete(h);
            }
            else if (v) {
                breq.headers.set(h, v);
            }
        }
    }
    return fetch(breq);
}