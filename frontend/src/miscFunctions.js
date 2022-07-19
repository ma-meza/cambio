export function integerToMoneyString(intValue) {
    let money = parseInt(intValue);
    let decimal = money % 100;
    if (decimal < 10) {
        decimal = "0" + decimal;
    }
    let lhs = Math.floor(money / 100).toString();
    let lhsString = "";
    let division3Remainder = lhs.length % 3;
    if (division3Remainder > 0) {
        lhsString += lhs.substring(0, division3Remainder) + ",";
    }
    for (let i = division3Remainder; i < lhs.length; i += 3) {
        lhsString += lhs.substring(i, i + 3) + ",";
    }
    lhsString = lhsString.substring(0, lhsString.length - 1);
    let moneyString = "$" + lhsString + "." + decimal;
    return moneyString;
}

export function integerMoneyToDecimal(intValue) {
    let money = parseInt(intValue);
    let decimal = (money % 100) * 0.01;
    let lhs = Math.floor(money / 100);
    return lhs + decimal;
}