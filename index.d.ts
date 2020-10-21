interface SelfReproducingClass {
    member: number
    new(spy? : () => void): SelfReproducingClass & unknown
}

declare const SelfReproducingClass : SelfReproducingClass;
export default SelfReproducingClass;