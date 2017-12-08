module.exports={
    distanceInMeters: function(miles){
        console.log(miles*1609.344);
        var meters = Math.round(miles*1609.344);
        return meters;
    }

}