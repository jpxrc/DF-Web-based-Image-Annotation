var local=false;
url = new Object();
if(local)
{
url.saveFreeFormPoint = "http://localhost:8080/FireflyRestServices/AnnotationService/saveFreeFormPoint";
url.saveFreeFormPoly = "http://localhost:8080/FireflyRestServices/AnnotationService/saveFreeFormPoly";
url.saveCircle = "http://localhost:8080/FireflyRestServices/AnnotationService/saveCircle";
url.saveBoxObject = "http://localhost:8080/FireflyRestServices/AnnotationService/saveBoxObject";
url.saveLineObject = "http://localhost:8080/FireflyRestServices/AnnotationService/saveLineObject";
url.savePointObject = "http://localhost:8080/FireflyRestServices/AnnotationService/savePointObject";
url.saveMarkedObjects = "http://localhost:8080/FireflyRestServices/AnnotationService/saveMarkedObjects";
url.deleteMarkedObject = "http://localhost:8080/FireflyRestServices/AnnotationService/deleteMarkedObjectList";
url.getMarkedObjects = "http://localhost:8080/FireflyRestServices/AnnotationService/getMarkedObjects";
url.getMarkedObjectsCache = "http://localhost:8080/FireflyRestServices/AnnotationService/getMarkedObjectsCacheable";
url.getFeatureObjects = "http://localhost:8080/FireflyRestServices/FeatureService/getFeatureObjects";

//login services
url.getall = "http://localhost:8080/FireflyRestServices/getall";
url.authenticateUser = "http://localhost:8080/FireflyRestServices/login";
url.logout = "http://localhost:8080/FireflyRestServices/logout";

url.geAnnotationsForImageSet = "http://localhost:8080/FireflyRestServices/AnnotationService/geAnnotationsForImageSet";
url.getUserLabs = "http://localhost:8080/FireflyRestServices/getUserLabs";
url.geFrameNamesForAnnotation = "http://localhost:8080/FireflyRestServices/AnnotationService/geFrameNamesForAnnotation";
url.getClassLayers = "http://localhost:8080/FireflyRestServices/ProjectService/getClassLayers";
url.getprojects = "http://localhost:8080/FireflyRestServices/ProjectService/getprojects";
url.getImageset = "http://localhost:8080/FireflyRestServices/AnnotationService/getImageset";

url.downloadAnnotationsForImageSet = "http://localhost:8080/FireflyRestServices/AnnotationService/downlaodAnnotation";

url.multiplayer = 'http://localhost:2001';
url.tile = 'http://firefly.cs.missouri.edu/tilingservice/tile_vips.php';

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
url.getprojects = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/ProjectService/getprojects";
url.getImageset = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/getImageset";

url.downloadAnnotationsForImageSet = "https://dragonfly.eecs.missouri.edu/FireflyRestServices/AnnotationService/downlaodAnnotation";

url.multiplayer = "https://dragonfly.eecs.missouri.edu:8000";
//"https://dragonfly.eecs.missouri.edu/Multiplayer";
url.tile = 'https://tile.eecs.missouri.edu/tile_vips.php';
}


