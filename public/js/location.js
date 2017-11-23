var btn = document.getElementById('geoLoc');
btn.addEventListener('click', getLocation);

function getLocation(){
    console.log("Tesst");
    if(navigator.geolocation)
    {
         navigator.geolocation.getCurrentPosition(callback,function(error){
            console.log(error);
            $('#tete').text(error.message);
        });
    }else{
        $('#error').text("Geolocation not Supported");
    }
        
};
function callback(position){
    var pos = {
         lat: position.coords.latitude,
         long:position.coords.longitude
    }
    console.log('location: '+ pos);

    //var request = new XMLHttpRequest();
    //request.setRequestHeader("Content-Type", "json;");
    //request.open("POST", "http://localhost:3000/geolocation", true);
    //request.send(JSON.stringify(pos)); 
    $('#tete').text(pos.lat + " : " + pos.long);
    $.post("/submit",pos,function(data){
      console.log(data);
    });
};