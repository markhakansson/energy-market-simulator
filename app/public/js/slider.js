function updateSliderVal(id, output) {
    var slider = document.getElementById(id);
    var op = document.getElementById(output);
    op.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        op.innerHTML = this.value;
    }
}
