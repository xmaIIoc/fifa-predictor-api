/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Observable } from 'rxjs/Observable';

// element to test
import { HelloWorldService } from '../../src';
import { GetHelloWorldRoute } from '../../src/module/routes';

@suite('- Unit GetHelloWorldRouteTest file')
class GetHelloWorldRouteTest {
    // private property to store mock service instance
    private _helloWorldServiceMock: any;
    // private property to store route instance
    private _getHelloWorldRoute: GetHelloWorldRoute;

    /**
     * Function executed before the suite
     */
    static before() {}

    /**
     * Function executed after the suite
     */
    static after() {}

    /**
     * Class constructor
     * New lifecycle
     */
    constructor() {}

    /**
     * Function executed before each test
     */
    before() {
        this._getHelloWorldRoute = new GetHelloWorldRoute(new HelloWorldService());
        this._helloWorldServiceMock = unit.mock(this._getHelloWorldRoute['_helloWorldService']);
    }

    /**
     * Function executed after each test
     */
    after() {
        this._getHelloWorldRoute = undefined;
        this._helloWorldServiceMock = undefined;
    }

    /**
     * Test if `GetHelloWorldRoute` as a `onGet` function
     */
    @test('- `GetHelloWorldRoute` must have `onGet` function')
    testGetHelloWorldRouteOnGet() {
        unit.function(this._getHelloWorldRoute.onGet);
    }

    /**
     * Test if `GetHelloWorldRoute.onGet()` function returns an Observable
     */
    @test('- `GetHelloWorldRoute.onGet()` function must return an Observable')
    testGetHelloWorldRouteOnGetObservable(done) {
        unit.object(this._getHelloWorldRoute.onGet(null)).isInstanceOf(Observable).when(_ => done());
    }
}
