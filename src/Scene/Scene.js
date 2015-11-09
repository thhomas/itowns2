/**
* Generated On: 2015-10-5
* Class: Scene
* Description: La Scene est l'instance principale du client. Elle est le chef orchestre de l'application.
*/

define('Scene/Scene',['Renderer/c3DEngine','Globe/Star','Globe/Globe','Renderer/NodeMesh','Core/Commander/ManagerCommands','Scene/BrowseTree'], function(c3DEngine,Star,Globe,NodeMesh,ManagerCommands,BrowseTree){
 
    var instanceScene = null;

    function Scene(){
        //Constructor
        
        if(instanceScene !== null){
            throw new Error("Cannot instantiate more than one Scene");
        } 
        
        this.nodes          = [];            
        this.cameras        = null;        
        this.selectNodes    = null;      
        this.managerCommand = ManagerCommands();
        this.gfxEngine      = c3DEngine();                       
        this.browserScene   = new BrowseTree(this);

    }

    Scene.prototype.constructor = Scene;
    /**
    */
    Scene.prototype.updateCommand = function(){
        //TODO: Implement Me 

    };
    
    
    Scene.prototype.currentCamera = function(){
        return this.gfxEngine.camera ;

    };
    
    Scene.prototype.init = function()
    {
     
        this.gfxEngine.init(this);        
        this.add(new Globe());
        //this.add(new Star()); 
        this.managerCommand.scene = this;        
        this.gfxEngine.renderScene();
        
    };

    /**
    */
    Scene.prototype.updateCamera = function(){
        //TODO: Implement Me 

    };

    /**
     * 
     * @returns {undefined}
     */
    Scene.prototype.sceneProcess = function(){
        
        if(this.nodes[0] !== undefined  && this.currentCamera() !== undefined )
        {                        
            this.browserScene.browse(this.nodes[0].terrain,this.currentCamera(),true);
            this.gfxEngine.update(); // TODO --> replace by renderScene
        } 
        
    };
    
    Scene.prototype.realtimeSceneProcess = function(){        
        if(this.nodes[0] !== undefined  && this.currentCamera !== undefined )
        {            
            this.browserScene.browse(this.nodes[0].terrain,this.currentCamera(),false);
        }                
    };
    
    /**
    */
    Scene.prototype.updateScene3D = function(){
        //TODO: Implement Me 
       
    };
    
    Scene.prototype.wait = function(){
        
        var waitTime = 250;                
        
        this.realtimeSceneProcess();
        
        if(this.timer === null)
        { 
            this.timer = window.setTimeout(this.sceneProcess.bind(this),waitTime); 
        }
        else
        {
            window.clearInterval(this.timer);
            this.timer = window.setTimeout(this.sceneProcess.bind(this),waitTime); 
        }
        
    };

    /**
    */
    Scene.prototype.renderScene3D = function(){
        
        this.gfxEngine.renderScene();

    };
    
    Scene.prototype.scene3D = function(){
        
        return this.gfxEngine.scene3D;
    };

    /**
    * @documentation: Ajoute des Layers dans la scène.
    *
    * @param layer {[object Object]} 
    */
    Scene.prototype.add = function(layer){
        //TODO: Implement Me 
        
        this.nodes.push(layer);
        
        if(layer instanceof NodeMesh)            
            
            this.gfxEngine.add3DScene(layer);

        else if(layer instanceof Globe)            
        {
            var meshs = layer.getMesh();
            for (var i = 0;i<meshs.length;i++)                            
                this.gfxEngine.add3DScene(meshs[i]);
            
            //this.gfxEngine.add3DScene(layer.atmosphere);            
        }
    };

    /**
    * @documentation: Retire des layers de la scène
    *
    * @param layer {[object Object]} 
    */
    Scene.prototype.remove = function(layer){
        //TODO: Implement Me 

    };


    /**
    * @param nodes {[object Object]} 
    */
    Scene.prototype.select = function(nodes){
        //TODO: Implement Me 

    };

    return function(){
        instanceScene = instanceScene || new Scene();
        return instanceScene;
    };

});

