function updateSliderVal(id, output) {
    var slider = document.getElementById(id);
    var out = document.getElementById(output);
    out.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        out.innerHTML = this.value;
    }
}
