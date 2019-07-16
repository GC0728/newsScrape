$.getJSON("/articles", function(data) {
    for (var i=0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + `<strong> ${data[i].headline} <strong>` + "<br />" + `<a href="${data[i].url}"> ${data[i].url} </a>` + "</p>");
    }
});

// onClick event for <p> target
$(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",   
        url: "/articles/" + thisId
    })
        .then(function(data) {
            console.log(data);
            $("#notes").append("<h2>" + data.headline + "</h2>");
            $("#notes").append("<input id='headlineinput' name='headline'>");
            $("#notes").append("<textarea id='bodyinput' name='body'>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");            


            if (data.note) {
                $("#headlineinput").val(data.note.headline);
                $("#bodyinput").val(data.note.body);
            }
        });
});

//onClick event for #saveNote <button>
$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            headline: $("#headlineinput").val(),
            body: $("bodyinput").val()
        }
    })
        .then(function(data) {
            console.log(data);
            $("#notes").empty();
        });

        $("#headlineinput").val("");
        $("#bodyinput").val("");
});

// onload event to execute scrape and populate scraped articles
