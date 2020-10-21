import {assert} from "chai";
import SelfReproducingClass from "./index";

const LEVEL = 100;

function getDerivedClass(level: number): SelfReproducingClass {
    return level > 0 ? new (getDerivedClass(level - 1)) : SelfReproducingClass;
}

function makeSuite(body: (iut: SelfReproducingClass) => void): () => void {
    return () => {
        for (let i = 0; i < LEVEL; ++i) {
            it(
                `level ${i}`
                , () => body(getDerivedClass(i))
            );
        }
    };
}

describe(
    'new returns an instance'
    , makeSuite(iut => assert.isTrue(new iut instanceof iut))
);

describe(
    'new returns a subclass'
    , makeSuite(iut => assert.isTrue(Object.prototype.isPrototypeOf.call(iut, new iut)))
);

describe(
    'newing the constructor returned by new returns an instance of this class as well'
    , makeSuite(iut => assert.isTrue(new new iut instanceof iut))
);

describe(
    'new returns different object every time'
    , makeSuite(iut => assert.notStrictEqual(new iut, new iut))
);

describe(
    'member is not shared between siblings'
    , makeSuite(iut => {
        const a = new iut;
        const b = new iut;
        a.member = 3;
        b.member = 5;
        assert.notStrictEqual(a.member, b.member);
    })
);

describe(
    'member is not propagated from child to parent'
    , makeSuite(iut => {
        const a = new iut;
        const b = new a;
        b.member = 5;
        assert.notStrictEqual(a.member, b.member);
    })
);

describe(
    'member is propagated from parent to child'
    , makeSuite(iut => {
        const a = new iut;
        const b = new a;
        a.member = 5;
        assert.strictEqual(b.member, a.member);
    })
);

describe(
    'setting property on child stops propagation'
    , makeSuite(iut => {
        const a = new iut;
        const b = new a;
        b.member = 3;
        a.member = 5;
        assert.notStrictEqual(b.member, a.member);
    })
);

describe(
    'constructor is called exactly once'
    , makeSuite(iut => {
        let count = 0;
        const spy = () => ++count;
        // noinspection ObjectAllocationIgnored
        new iut(spy);
        assert.strictEqual(count, 1);
    })
);