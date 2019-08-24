platform = "";
battletag = "";
pd = "";
elvls = [25,100,200,400,800];

function parsesitedata() {
    if (document.getElementById("pc").checked)
        platform = "pc";
    if (document.getElementById("psn").checked)
        platform = "psn";
    if (document.getElementById("xbl").checked)
        platform = "xbl";

    battletag_regex = /[a-zA-Z0-9]{5,}#[0-9]{4}/;
    battletag_regex_console = /[a-zA-Z0-9]{4,}/
    battletag = document.getElementById("text_battletag").value;
    if(platform==="pc"){
        if(battletag_regex.test(battletag) === false){
            alert("Incorrect BattleTag.");
        }
        else{
            getprofile();
        }
    }
    else if(platform==="xbl"||platform=="psn"){
        if(battletag_regex_console.test(battletag) === false){
            alert("Incorrect nick.");
        }
        else{
            getprofile();
        }
    }
}

function getprofile(){
    $("#main_container").append(`
    <div id="loading">
    Loading profile...
    `);

    $("#get_profile").remove();
    
    
    setTimeout(function(){
    battletag = battletag.replace("#", "-");
    $.ajax({
        async: false,
        type: "GET",
        url: "https://cors-anywhere.herokuapp.com/https://playoverwatch.com/en-us/career/" + platform + "/" + battletag,
        success: function(data){
            pd = data;
        }
    });
    
    sc = $(pd).find(".EndorsementIcon-border--shotcaller").attr("data-value");
    gt = $(pd).find(".EndorsementIcon-border--teammate").attr("data-value");
    ss = $(pd).find(".EndorsementIcon-border--sportsmanship").attr("data-value");
    elvl = $(pd).find(".u-center").html();
    av = $(pd).find(".player-portrait").attr("src");

    if(typeof elvl !== "undefined"){
    sc = Math.round(sc*100);
    gt = Math.round(gt*100);
    ss = Math.round(ss*100);
    scnb = Math.round(sc*elvls[elvl-1]/100);
    gtnb = Math.round(gt*elvls[elvl-1]/100);
    ssnb = Math.round(ss*elvls[elvl-1]/100);

    $("#loading").remove();

    battletag = battletag.replace("-", "#");

    document.getElementById("title").innerHTML = `<img src="`+av+`">`+battletag;
    $("footer").html("Hover over any value to view estimated amount of endorsements - Blizzard doesn't give exact figures for these :(<br>Overwatch™, Overwatch logo and BattleTag™ are registered trademarks and property of Blizzard Entertainment, Inc. Design and coding by Calslock. Made with JQuery and love ❤️");

    $("#main_container").append(`
    <div id="content">
        <div id="end">
        </div>
        <div id="stats">
            <table>
                <tr>
                    <td><img src="images/SHOT_CALLER.png"></td>
                    <td><img src="images/GOOD_TEAMMATE.png"></td>
                    <td><img src="images/SPORTSMANSHIP.png"></td>
                </tr>
                <tr>
                    <td><a href='#' class="hoverable"><span id="scp" class="normal"></span><span id="scn" class="hover"></span></a></td>
                    <td><a href='#' class="hoverable"><span id="gtp" class="normal"></span><span id="gtn" class="hover"></span></a></td>
                    <td><a href='#' class="hoverable"><span id="ssp" class="normal"></span><span id="ssn" class="hover"></span></a></td>
                </tr>
            </table>
        </div>
    </div>
    `);

    $("#end").text("Endorsement Level: " + elvl);
    $("#scp").html(sc + "%");
    $("#gtp").html(gt + "%");
    $("#ssp").html(ss + "%");
    $("#scn").html("~" + scnb);
    $("#gtn").html("~" + gtnb);
    $("#ssn").html("~" + ssnb);
    }
    else{
        $("#loading").html("Profile doesn't exist.");
    }

}, 500);

}

function switchplatform(x){
    if(x==0) document.getElementById("text_battletag").placeholder = "Your BattleTag™";
    else document.getElementById("text_battletag").placeholder = "Your nick"
}