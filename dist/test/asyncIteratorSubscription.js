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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var sinon_1 = require("sinon");
var sinonChai = require("sinon-chai");
var pubsub_1 = require("../pubsub");
var with_filter_1 = require("../with-filter");
var isAsyncIterableIterator = function (input) {
    return input != null && typeof input[Symbol.asyncIterator] === 'function';
};
chai.use(chaiAsPromised);
chai.use(sinonChai);
var expect = chai.expect;
var graphql_1 = require("graphql");
var subscription_1 = require("graphql/subscription");
var FIRST_EVENT = 'FIRST_EVENT';
var defaultFilter = function (payload) { return true; };
function buildSchema(iterator, filterFn) {
    if (filterFn === void 0) { filterFn = defaultFilter; }
    return new graphql_1.GraphQLSchema({
        query: new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: {
                testString: {
                    type: graphql_1.GraphQLString,
                    resolve: function (_, args) {
                        return 'works';
                    },
                },
            },
        }),
        subscription: new graphql_1.GraphQLObjectType({
            name: 'Subscription',
            fields: {
                testSubscription: {
                    type: graphql_1.GraphQLString,
                    subscribe: (0, with_filter_1.withFilter)(function () { return iterator; }, filterFn),
                    resolve: function (root) {
                        return 'FIRST_EVENT';
                    },
                },
            },
        }),
    });
}
describe('GraphQL-JS asyncIterator', function () {
    it('should allow subscriptions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, pubsub, origIterator, schema, results, payload1, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = (0, graphql_1.parse)("\n      subscription S1 {\n\n        testSubscription\n      }\n    ");
                    pubsub = new pubsub_1.PubSub();
                    origIterator = pubsub.asyncIterableIterator(FIRST_EVENT);
                    schema = buildSchema(origIterator);
                    return [4, (0, subscription_1.subscribe)({ schema: schema, document: query })];
                case 1:
                    results = _a.sent();
                    payload1 = results.next();
                    expect(isAsyncIterableIterator(results)).to.be.true;
                    r = payload1.then(function (res) {
                        expect(res.value.data.testSubscription).to.equal('FIRST_EVENT');
                    });
                    pubsub.publish(FIRST_EVENT, {});
                    return [2, r];
            }
        });
    }); });
    it('should allow async filter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, pubsub, origIterator, schema, results, payload1, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = (0, graphql_1.parse)("\n      subscription S1 {\n\n        testSubscription\n      }\n    ");
                    pubsub = new pubsub_1.PubSub();
                    origIterator = pubsub.asyncIterableIterator(FIRST_EVENT);
                    schema = buildSchema(origIterator, function () { return Promise.resolve(true); });
                    return [4, (0, subscription_1.subscribe)({ schema: schema, document: query })];
                case 1:
                    results = _a.sent();
                    payload1 = results.next();
                    expect(isAsyncIterableIterator(results)).to.be.true;
                    r = payload1.then(function (res) {
                        expect(res.value.data.testSubscription).to.equal('FIRST_EVENT');
                    });
                    pubsub.publish(FIRST_EVENT, {});
                    return [2, r];
            }
        });
    }); });
    it('should detect when the payload is done when filtering', function (done) {
        var query = (0, graphql_1.parse)("\n      subscription S1 {\n        testSubscription\n      }\n    ");
        var pubsub = new pubsub_1.PubSub();
        var origIterator = pubsub.asyncIterableIterator(FIRST_EVENT);
        var counter = 0;
        var filterFn = function () {
            counter++;
            if (counter > 10) {
                var e = new Error('Infinite loop detected');
                done(e);
                throw e;
            }
            return false;
        };
        var schema = buildSchema(origIterator, filterFn);
        Promise.resolve((0, subscription_1.subscribe)({ schema: schema, document: query })).then(function (results) {
            expect(isAsyncIterableIterator(results)).to.be.true;
            results.next();
            results.return();
            pubsub.publish(FIRST_EVENT, {});
            setTimeout(function (_) {
                done();
            }, 500);
        });
    });
    it('should clear event handlers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, pubsub, origIterator, returnSpy, schema, results, end, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = (0, graphql_1.parse)("\n      subscription S1 {\n        testSubscription\n      }\n    ");
                    pubsub = new pubsub_1.PubSub();
                    origIterator = pubsub.asyncIterableIterator(FIRST_EVENT);
                    returnSpy = (0, sinon_1.spy)(origIterator, 'return');
                    schema = buildSchema(origIterator);
                    return [4, (0, subscription_1.subscribe)({ schema: schema, document: query })];
                case 1:
                    results = _a.sent();
                    end = results.return();
                    r = end.then(function (res) {
                        expect(returnSpy).to.have.been.called;
                    });
                    pubsub.publish(FIRST_EVENT, {});
                    return [2, r];
            }
        });
    }); });
});
function isEven(x) {
    if (x === undefined) {
        throw Error('Undefined value passed to filterFn');
    }
    return x % 2 === 0;
}
var testFiniteAsyncIterator = (function () {
    return __asyncGenerator(this, arguments, function () {
        var _i, _a, value;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = [1, 2, 3, 4, 5, 6, 7, 8];
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 5];
                    value = _a[_i];
                    return [4, __await(value)];
                case 2: return [4, _b.sent()];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3, 1];
                case 5: return [2];
            }
        });
    });
})();
describe('withFilter', function () {
    it('works properly with finite asyncIterators', function () { return __awaiter(void 0, void 0, void 0, function () {
        var filteredAsyncIterator, i, result, doneResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, with_filter_1.withFilter)(function () { return testFiniteAsyncIterator; }, isEven)()];
                case 1:
                    filteredAsyncIterator = _a.sent();
                    i = 1;
                    _a.label = 2;
                case 2:
                    if (!(i <= 4)) return [3, 5];
                    return [4, filteredAsyncIterator.next()];
                case 3:
                    result = _a.sent();
                    expect(result).to.not.be.undefined;
                    expect(result.value).to.equal(i * 2);
                    expect(result.done).to.be.false;
                    _a.label = 4;
                case 4:
                    i++;
                    return [3, 2];
                case 5: return [4, filteredAsyncIterator.next()];
                case 6:
                    doneResult = _a.sent();
                    expect(doneResult).to.not.be.undefined;
                    expect(doneResult.value).to.be.undefined;
                    expect(doneResult.done).to.be.true;
                    return [2];
            }
        });
    }); });
    it('does not leak memory with promise chain #memory', function () {
        return __awaiter(this, void 0, void 0, function () {
            var stopped, index, asyncIterator, filteredAsyncIterator, heapUsed, nextPromise, heapUsed2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(5000);
                        stopped = false;
                        index = 0;
                        asyncIterator = {
                            next: function () {
                                if (stopped) {
                                    return Promise.resolve({ done: true, value: undefined });
                                }
                                index += 1;
                                return new Promise(function (resolve) { return setImmediate(resolve); })
                                    .then(function () { return ({ done: false, value: index }); });
                            },
                            return: function () {
                                return Promise.resolve({ value: undefined, done: true });
                            },
                            throw: function (error) {
                                return Promise.reject(error);
                            },
                        };
                        return [4, (0, with_filter_1.withFilter)(function () { return asyncIterator; }, function () { return stopped; })()];
                    case 1:
                        filteredAsyncIterator = _a.sent();
                        global.gc();
                        heapUsed = process.memoryUsage().heapUsed;
                        nextPromise = filteredAsyncIterator.next();
                        return [4, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                    case 2:
                        _a.sent();
                        global.gc();
                        heapUsed2 = process.memoryUsage().heapUsed;
                        stopped = true;
                        return [4, nextPromise];
                    case 3:
                        _a.sent();
                        expect(Math.max(0, heapUsed2 - heapUsed) / heapUsed).to.be.lessThan(0.01);
                        return [2];
                }
            });
        });
    });
});
//# sourceMappingURL=asyncIteratorSubscription.js.map