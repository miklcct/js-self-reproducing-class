class SelfReproducingClass {
    constructor(spy) {
        if (spy !== undefined) {
            spy();
        }

        const This = this.constructor;

        // make the constructor of Derived calling the constructor of This
        class Derived extends This {
            constructor(...args) {
                return Reflect.construct(This, args, new.target);
            }
        }

        // make "new Derived" a subclass of "Derived"
        Object.setPrototypeOf(Derived.prototype, Derived);

        // make Derived an instance of This
        Object.setPrototypeOf(Derived, This.prototype);

        return Derived;
    }

    static member = 0;
}

// make "new SelfReproducingClass" a subclass of SelfReproducingClass
Object.setPrototypeOf(SelfReproducingClass.prototype, SelfReproducingClass);

module.exports = SelfReproducingClass;