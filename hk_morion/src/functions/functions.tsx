export function Ru(item:number) {
    return new Intl.NumberFormat("ru", {style: "currency", currency: "RUB"}).format(item)
}