const submitBtn = document.getElementById('submit-button');
const deviceName = document.getElementById('device-name');

//shorthands tp check validity
const isEmpty = value => value === '';
const isWithin = (number, min, max) => {
    return !(number < min || number > max);
};

function runValidityChecks() {
    //collect all inputs
    const inputs = document.querySelectorAll(".input");
    //iterate through the inputs array
    for(let e of inputs) {
        //check if is empty
        if (isEmpty(e.value)) {
            alert(`The value of ${e.name} is empty. Please fill it in.`);
            e.focus();
            return false;
        }
        //if it is a number field - check if it is a number and within the range of -50/+100
        if (e.type.toString() === "number") {
            //check if number using JS isNaN method
            if (isNaN(parseInt(e.value))) {
                alert(`The value of ${e.name} is not a number. Please make sure it is a number.`);
                e.focus();
                return false;
            //check if value is within the reasonable limits
            } else if (!isWithin(parseInt(e.value), -50, 100)) {
                alert(`The value of ${e.name} is not within -50, 100. Please make sure it is more -50 and less 100.`);
                e.focus();
                return false;
            }
        }
    }
    return true;
}