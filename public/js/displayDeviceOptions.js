const traitsDiv = document.getElementById('device-traits');
//helper functions - reusable modules, that create HTML elements
const createWrapper = () => {
    //wrapper div
    let wrapper = document.createElement("div");
    wrapper.className = "toggle-wrapper";
    wrapper.classList.add("grid");
    return wrapper;
}
const createDeviceType = (device) => {
    let h2 = document.createElement("h2");
    h2.textContent = "Device type: " + device.deviceType;
    h2.className = "type-heading";
    return h2;
}
const createDeviceNameInput = (existingDevice) => {
    let deviceNameInputHeading = document.createElement("h2");
    deviceNameInputHeading.className = "field-heading";

    let deviceNameInput = document.createElement("input");
    deviceNameInput.type = "text";
    deviceNameInput.name = "deviceName";
    deviceNameInput.id = "device-name";
    deviceNameInput.classList.add("input");

    if (existingDevice) {
        deviceNameInputHeading.textContent = "Rename your device: ";
        deviceNameInput.defaultValue = existingDevice;
    } else {
        deviceNameInputHeading.textContent = "Name your device: ";
    }

    return [deviceNameInputHeading, deviceNameInput];
}
const createSettingName = (setting) => {
    let h2 = document.createElement("h2");
    h2.textContent = setting + ":";
    h2.className = "field-heading";
    return h2;
}
const createSettingInputTag = (setting) => {
    let input = document.createElement("input");
    input.classList.add("input");
    input.name = setting;
    return input;
}
const createBoolLabel = () => {
    let label = document.createElement("label");
    label.className = "switch";
    return label;
}
const createBooleanInput = (input, setting, settingValue) => {
    //hidden input to pass "false" value of the checkbox
    let hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.value = "false";
    hiddenInput.name = setting;
    //input itself
    input.type = "checkbox";
    input.defaultValue = input.defaultChecked.toString();
    input.addEventListener("change", (event) => {
        boolCheckbox(event.target);
    });
    //if the value of the setting in the database is true, then make the toggle input initial as "on"
    if(settingValue === "true") {
        hiddenInput.disabled = true;
        input.defaultValue = "true";
        input.checked = true;
    }

    //span to let it be like a toggle
    let span = document.createElement("span");
    span.classList.add("slider");
    span.classList.add("round");

    return [hiddenInput, input, span];
}
const createSubmitBtn = () => {
    let submitBtn = document.createElement("button");
    submitBtn.className = "orange-button";
    submitBtn.classList.add("submit-button");
    submitBtn.id = "submit-button";
    return submitBtn;
}
//function to clean the fields of the form
const cleanFields = () => {
    traitsDiv.innerText = '';
}

//get fields depending on the device options
const getTraits = (device, deviceTypesArr) => {
    //if default user chose "select device type" - delete everything
    if (device === "null") {
        cleanFields();
        return;
    }
    //define the traits for the selected device
    for (let d of deviceTypesArr) {
        if (d.name.toString() === device.toString()) {
            renderFields(d.traits);
        }
    }
}

//get boolean value from the checkbox and hide the "hidden input"
// providing the way around checked boolean value to be sent to database
function boolCheckbox(checkbox) {
    if (checkbox.checked) {
        checkbox.value = "true";
        checkbox.parentElement.firstChild.disabled = true;
    } else {
        checkbox.value = "false";
        checkbox.parentElement.firstChild.disabled = false;
    }
}

//render the settings on the control page
const renderSettings = (device) => {
    //clear the parent
    cleanFields();
    //device type
    let h2 = createDeviceType(device);
    traitsDiv.appendChild(h2);
    //wrapper div
    let wrapper = createWrapper()
    traitsDiv.appendChild(wrapper);

    //allow user to name his device

    for (let element of createDeviceNameInput(device.name)) {
        wrapper.appendChild(element);
    }

    //heading of the field
    for (let trait in device.traits) {
        // if (device.traits.hasOwnProperty(trait)) {
            // create left side setting field
            let settingName = createSettingName(trait);
            wrapper.appendChild(settingName);
            // create input tag
            let input = createSettingInputTag(trait);
            //change input depending on the type of the trait
            let traitValue = device.traits[trait].toString()
            if (traitValue === "true" || traitValue === "false") {
                //label
                let label = createBoolLabel();
                wrapper.appendChild(label);
                // create boolean input "toggle"
                let boolInput = createBooleanInput(input, trait, traitValue);
                for (let element of boolInput) {
                    label.append(element);
                }
            } else {
                    //input "number"
                    input.type = "number";
                    input.defaultValue = device.traits[trait].toString();
                    wrapper.appendChild(input);
            }
        // }
    }
    //submit button
    const submitBtn = createSubmitBtn();
    submitBtn.textContent = "UPDATE DEVICE";
    wrapper.appendChild(submitBtn);
}

// render all fields for the form and hide not relevant to the device
const renderFields = (traits) => {
    //refresh
    cleanFields();

    //wrapper grid to populate with inputs from database
    let wrapper = createWrapper()
    traitsDiv.appendChild(wrapper);

    //allow user to name his device
    let deviceNameInput = createDeviceNameInput(null);
    for (let element of deviceNameInput) {
            wrapper.appendChild(element);
    }

    //create inputs according to the number of traits
    traits.forEach((e) => {
        //heading of the field
        let settingName = createSettingName(e.trait_name);
        wrapper.appendChild(settingName);
        //create input tag
        let input = createSettingInputTag(e.trait_name);
        //change input depending on the type of the trait
        switch (e.trait_type.toString()) {
            case "boolean":
                //label
                const label = createBoolLabel();
                wrapper.appendChild(label);
                // create boolean input "toggle"
                let boolInput = createBooleanInput(input, e.trait_name);
                for (let element of boolInput) {
                    label.append(element);
                }
                break;
            case "integer":
                //input "number"
                input.type = "number";
                wrapper.appendChild(input);
        }
    })
    //submit button
    const submitBtn = createSubmitBtn();
    submitBtn.textContent = "ADD DEVICE";
    wrapper.appendChild(submitBtn);
}

//get function checking the function input and calling rendering function
const getDeviceSettings = (selectedDeviceName, devicesArray) => {
    for (let deviceObj of devicesArray) {
        if (selectedDeviceName === deviceObj.name) {
            renderSettings(deviceObj);
        }
    }
}