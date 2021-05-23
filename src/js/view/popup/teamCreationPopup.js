var personalWork = document.getElementById('btn-team-creation');

function teamPopup() {
    var url = "teamCreationPopup.html";
    var name = "team-creation";
    var option = "width=475, height=195, location=no";

    window.open(url, name, option);
}

personalWork.addEventListener('click', function() {
    teamPopup();
})