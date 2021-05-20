var personalWork = document.getElementById('btn-team-work');

function teamPopup() {
    var url = "teamWorkPopup.html";
    var name = "team-work";
    var option = "width=475, height=195, location=no";

    window.open(url, name, option);
}

personalWork.addEventListener('click', function() {
    teamPopup();
})