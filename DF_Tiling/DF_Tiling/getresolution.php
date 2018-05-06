<?php

$resolution = 0;
//read input parameters
if(isset($_GET["path"]))
  $path = $_GET["path"];

if(isset($_GET["image"]))
  $image = $_GET["image"];

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type');
//set header content type
header('Content-type: application/json');
		        // form ful image path
			$full_path=$path.$image;
			//load the tiff
			//$image = new Imagick($full_path);
			//get number of pages from in the ptif
			//$resolution = $image->getNumberImages();
			//remove loaded image from memory
			//$image->destroy();
			//$output =  shell_exec('identify -format %n $full_path');
			$output =  shell_exec("identify -format %n '$full_path'");
			echo $output;
			//echo $resolution;

?>
