document.addEventListener("DOMContentLoaded", main);

let show = true;

function main() {
    document.getElementById("btn").innerHTML = "<<";
    document.getElementById("btn").addEventListener("click", () => {
        if (show) {
            document.getElementById("box").hidden = true;
            document.getElementById("btn").innerHTML = ">>";
            show = false;
        } else {
            document.getElementById("box").hidden = false;
            document.getElementById("btn").innerHTML = "<<";
            show = true;
        }
    });
}
