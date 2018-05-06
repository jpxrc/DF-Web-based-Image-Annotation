

function Vector(x,y) {
  // TODO: Finish the Vector class.
  this.x = x;
  this.y = y;
}


//  Singleton instance of the context End

function Tile(tile_vector, pos_vector)
{

  //tile_vector : holds index of the tile in the image tile-0-1.png - 0th row, 1st column
  this.tile_vector = tile_vector;

  //pos_vector : holds cordinates on the canvas where the tile will be placed
  this.pos_vector = pos_vector;

  //True if the tile already has image loaded
  this.iscached = false;

  //The image that the tile shows
  this.image;

  this.key = "tile_"+tile_vector.x+''+tile_vector.y;
  
  this.load_image = function()
  {

    var ctx = context.getInstance();
    console.log("this.iscached :: "+this.iscached);
    var base_image;
    if(!this.iscached)
    {
       base_image  = new Image();
      base_image.src = './tiles_again/tiled_'+tile_vector.x+'_'+tile_vector.y+'.png';
      base_image.onload = function() {
          ctx.drawImage(base_image,pos_vector.x ,pos_vector.y);
          
      };

    }
     //ctx.drawImage(base_image,pos_vector.x ,pos_vector.y);

    
  }

}
