jest.mock('memcached');
const Memcached = require('memcached');
const {MemoryStore, MemcacheStore, createStore} = require('../link-store');

describe('Link Store', () => {
    let store;

    function testAPI() {
        describe('#get', () => {
            describe('when key not set', () => {
                it('returns a Promise', () => {
                    expect(store.get('moot')).toBeInstanceOf(Promise);
                });

                it('resolves to null', () => {
                    return store.get('1928n1-89n2').then(result => {
                        expect(result).toBe(null);
                    });
                });
            });
        });

        describe('#has', () => {
            describe('when key not set', () => {
                it('returns a Promise', () => {
                    expect(store.has('moot')).toBeInstanceOf(Promise);
                });

                it('resolves to false', () => {
                    return store.has('1928n1-89n2').then(result => {
                        expect(result).toBe(false);
                    });
                });
            });
        });

        describe('#set', () => {
            [
                'string',
                {a: 'n', obj: 'ect'},
            ].forEach(payload => {
                describe(`when data "${payload}"`, () => {
                    it('returns a Promise', () => {
                        expect(store.set('A', 'B')).toBeInstanceOf(Promise);
                    });

                    describe('after Promise resolves', () => {
                        beforeEach(() => {
                            return store.set('A',payload);
                        });

                        it('value can be retrieved', () => {
                            return store.get('A').then(value => {
                                expect(value).toEqual(payload);
                            });
                        });

                        it('value can be asked for existence', () => {
                            return store.has('A').then(value => {
                                expect(value).toBe(true);
                            });
                        });
                    });
                });
            });
        });
    }

    describe('when no special variable set', () => {
        beforeEach(() => {
            store = createStore();
        });

        it('creates a in-memory store', () => {
            expect(store).toBeInstanceOf(MemoryStore);
        });

        describe('Memory Store', testAPI);
    });

    describe('when Memcache env set', () => {
        const MOCK_URL = 'localhost:11211';

        function FakeMemcache(url) {
            this.url = url;
            this.fakeStore = new Map();

            this.get = jest.fn().mockImplementation((key, cb) => {
                setTimeout(() => cb(null, this.fakeStore.get(key)));
            });

            this.set = jest.fn().mockImplementation((key, val, opts, cb) => {
                setTimeout(() => cb(null, this.fakeStore.set(key, Buffer.from(val))));
            });
        }

        beforeEach(() => {
            process.env.MEMCACHE_URL = MOCK_URL;
            Memcached.mockImplementation(url => new FakeMemcache(url));
            store = createStore();
        });

        afterEach(() => {
            delete process.env.MEMCACHE_URL;
        });

        it('creates a MemcacheStore', () => {
            expect(Memcached.mock.calls.length).toBe(1);
            expect(Memcached.mock.calls[0][0][0]).toBe(MOCK_URL);
            expect(store).toBeInstanceOf(MemcacheStore);
        });

        describe('Memcache Store', testAPI);
    });
});
