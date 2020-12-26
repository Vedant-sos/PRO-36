class Food{
    constructor(){
        this.foodStockref=database.ref('food');
        this.foodStockref.on("value",(data)=>{
         this.foodStock=data.val();
        });
        this.lastFed=null;
        this.image=loadImage("images/Milk.png");
    }
    getfoodStock(){
        return this.foodStock;
    }

    updatefoodStock(foodStock){
           this.foodStock=foodStock;
        
    }
    deductfoodStock(){
        if(this.foodStock>0){
            this.foodStock=this.foodStock-1;
        }
    }
    bedroom(){
        background(bedroom,550,550);
    }
    garden(){
        background(garden,550,550);
    }
    washroom(){
        background(washroom,550,550);
    }

    
    display(){
        var x=80;
        var y=50;
        
        if(this.foodStock>0){
            for(var i=0;i<this.foodStock;i++){
                if(i%10===0){
                    x=80;
                    y=y+50;
                }
                imageMode(CENTER);
                image(this.image,x,y,50,50);
                x=x+30;
            }
        }
    }
}