var local=true;
url = new Object();
default_url = new Object();
if(local)
{
url.saveFreeFormPoint = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/saveFreeFormPoint";
url.saveFreeFormPoly = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/saveFreeFormPoly";
url.saveCircle = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/saveCircle";
url.saveBoxObject = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/saveBoxObject";
url.saveLineObject = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/saveLineObject";
url.savePointObject = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/savePointObject";
url.saveMarkedObjects = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/saveMarkedObjects";
url.deleteMarkedObject = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/deleteMarkedObjectList";
url.getMarkedObjects = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/getMarkedObjects";
url.getMarkedObjectsCache = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/getMarkedObjectsCacheable";
url.getFeatureObjects = "http://128.206.119.13:8080/FireflyRestServices/FeatureService/getFeatureObjects";

//login services
url.getall = "http://128.206.119.13:8080/FireflyRestServices/getall";
url.authenticateUser = "http://128.206.119.13:8080/FireflyRestServices/login";
url.logout = "http://128.206.119.13:8080/FireflyRestServices/logout";

url.geAnnotationsForImageSet = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/geAnnotationsForImageSet";
url.getUserLabs = "http://128.206.119.13:8080/FireflyRestServices/getUserLabs";
url.geFrameNamesForAnnotation = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/geFrameNamesForAnnotation";
url.getClassLayers = "http://128.206.119.13:8080/FireflyRestServices/ProjectService/getClassLayers";
url.geturls = "http://128.206.119.13:8080/FireflyRestServices/ProjectService/getUrls";
url.getprojects = "http://128.206.119.13:8080/FireflyRestServices/ProjectService/getprojects";
url.getImageset = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/getImageset";

url.downloadAnnotationsForImageSet = "http://128.206.119.13:8080/FireflyRestServices/AnnotationService/downlaodAnnotation";

url.multiplayer = 'http://128.206.119.13:2001';
url.tile = 'http://128.206.119.13/tilingservice/tile_vips.php';
url.resolution = 'http://128.206.119.13/tilingservice/getresolution.php';
default_url.tile = 'http://128.206.119.13/tilingservice';

}
else
{
url.saveFreeFormPoint = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/saveFreeFormPoint";
url.saveFreeFormPoly = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/saveFreeFormPoly";
url.saveCircle = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/saveCircle";
url.saveBoxObject = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/saveBoxObject";
url.saveLineObject = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/saveLineObject";
url.savePointObject = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/savePointObject";
url.saveMarkedObjects = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/saveMarkedObjects";
url.deleteMarkedObject = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/deleteMarkedObjectList";
url.getMarkedObjects = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/getMarkedObjects";
url.getMarkedObjectsCache = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/getMarkedObjectsCacheable";
url.getFeatureObjects = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/FeatureService/getFeatureObjects";

//login services
url.getall = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/getall";
url.authenticateUser = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/login";
url.logout = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/logout";
url.geAnnotationsForImageSet = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/geAnnotationsForImageSet";
url.getUserLabs = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/getUserLabs";
url.geFrameNamesForAnnotation = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/geFrameNamesForAnnotation";
url.getClassLayers = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/ProjectService/getClassLayers";
url.geturls = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/ProjectService/getUrls";
url.getprojects = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/ProjectService/getprojects";
url.getImageset = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/getImageset";

url.downloadAnnotationsForImageSet = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/downlaodAnnotation";

url.multiplayer = "https://dragonfly.eecs.missouri.edu:8000";
//"https://dragonfly.eecs.missouri.edu/Multiplayer";
url.tile = 'https://tile.eecs.missouri.edu/tile_vips.php';
url.resolution = 'https://tile.eecs.missouri.edu/getresolution.php';
default_url.tile = 'https://tile.eecs.missouri.edu';

}


