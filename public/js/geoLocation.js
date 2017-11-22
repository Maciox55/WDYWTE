var btn = document.getElementById('geoLoc');
btn.addEventListener('click', getLocation());
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(funciton(position){
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            errorHandler(true);
            $('#tete').text(pos.lat + " : " + pos.long);
            $.post("/geolocation",pos,function(data){
              console.log(data);
            },{timeout:30000});
            
        });
    } else{
        errorHandler(false);
    }
};
function errorHandler(browserHasGeolocaiton){
    $('#tete').text(pos.lat + " : " + pos.long);

}
