function SelfReproducingClass(spy) {
    if (spy !== undefined) {
        spy();
    }

    const This = this.constructor;

    // make the constructor of Derived calling the constructor of This
    const Derived = function (...args) {
        return This.apply(this, args);
    };

    // make Derived an instance of This
    Object.setPrototypeOf(Derived, This.prototype);

    // make "new Derived" a subclass of "Derived"
    Object.setPrototypeOf(Derived.prototype, Derived);

    return Derived;
}
// make "new SelfReproducingClass" a subclass of SelfReproducingClass
Object.setPrototypeOf(SelfReproducingClass.prototype, SelfReproducingClass);

// member variable
SelfReproducingClass.member = 0;

module.exports = SelfReproducingClass;