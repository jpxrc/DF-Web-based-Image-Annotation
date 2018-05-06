<?php

$resolution = 0;
$x = 0;
$y = 0;


if(isset($_GET["path"]))
  $path = $_GET["path"];

if(isset($_GET["image"]))
  $image = $_GET["image"];

if(isset($_GET["resolution"]))
  $resolution = $_GET["resolution"];

if(isset($_GET["maxresolution"]))
  $maxresolution = $_GET["maxresolution"];

if(isset($_GET["col"]))
  $x = $_GET["col"];

if(isset($_GET["row"]))
  $y = $_GET["row"];

$resolution = $maxresolution - $resolution;
$width = 256;
$height = 256;
header("Access-Control-Allow-Origin: *");
			$full_path=$path.$image;
			$output_image_path=$image.'_'.$resolution.'_'.$x.'_'.$y;
			$output_image_path=str_replace('.', '_', $output_image_path);
			$output_image_path=$output_image_path.'.jpg';
			$read_image=$full_path.'[page='.$resolution.']';
			$image_filename=$full_path.'['.$resolution.']';
			$top=$x*$width;
			$left=$y*$height;
			
			$image_width=exec("identify -format %w '$image_filename'");
                	$image_height=exec("identify -format %h '$image_filename'");
			if($top+$width > $image_width)
			{
				$width = $image_width - $top;
			}
			if($left+$height > $image_height)
                        {
                                $height = $image_height - $left;
                        }
			$params = './run_vips.sh extract_area  '.$read_image.'  '.$output_image_path.'  '.$top.'  '.$left.'  '.$width.'  '.$height;
			exec( $params);
			$image = new Imagick($output_image_path);
			$image->setImagePage(0, 0, 0, 0);

			$image->setImageFormat( "jpeg" );
			
			//$image->cropImage($width ,$height ,$x*$width , $y*$height );
			//$image->setImagePage(0, 0, 0, 0);
			header('Content-type: image/jpeg');
			//$output = shell_exec("/usr/local/bin/vips --version");
			#echo $params;
			echo $image->getImageBlob();
			$image->destroy();
			shell_exec("rm '$output_image_path'");

                       //echo $temp;
?>

