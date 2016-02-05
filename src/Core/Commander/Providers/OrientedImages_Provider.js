/**
* Generated On: 2016-02-3
* Class: OrientedImages_Provider
* Description: Serve Oriented Images
*/


define('Core/Commander/Providers/OrientedImages_Provider',[
            'Core/Commander/Providers/Provider',
            'Core/Commander/Providers/IoDriver_Image',
            'Core/Commander/Providers/IoDriverXML',
            'Core/Commander/Providers/BatiRGE_Provider',
            'when',
            'Core/Math/Ellipsoid',
            'Core/Geographic/CoordCarto',
            'Renderer/c3DEngine',
            'Scene/BrowseTree',
            'THREE',
            'Renderer/Ori',
            'Core/Commander/Providers/CacheRessource',
            'Renderer/ProjectiveTexturing2'], 
        function(
                Provider,
                IoDriver_Image,
                IoDriverXML,
                BatiRGE_Provider,
                when,
                Ellipsoid,
                CoordCarto,
                gfxEngine,
                BrowseTree,
                THREE,      
                Ori,
                CacheRessource,
                ProjectiveTexturing2){


    function OrientedImages_Provider()
    {
        //Constructor
 
        Provider.call(this, new IoDriver_Image()); // Should be JSON
     //   this.cache         = CacheRessource();        
        this.ioDriverImage = new IoDriver_Image();
        this.ioDriverXML = new IoDriverXML();
       
    }

    OrientedImages_Provider.prototype = Object.create( Provider.prototype );
    OrientedImages_Provider.prototype.constructor = OrientedImages_Provider;
    
  
    /**
     * Return url Oriented Images Services
     * @param {type} coWMTS : coord WMTS
     * @returns {Object@call;create.url.url|String}
     */
    OrientedImages_Provider.prototype.url = function(URLServiceOrientedImages, position)
    {
       
        var url = "adresseALaMappillary at position";  
        return url;
    };
            
            
    /**
     * Return url Images
     * @param {type} coWMTS
     * @returns {Object@call;create.urlOrtho.url|String}
     */
    OrientedImages_Provider.prototype.urlImages = function()
    {            
        var url = "../itowns-sample-data/images/140616/Paris-140616_0740-301-00001_0000494.jpg";
        return url;
    };
        
        
    OrientedImages_Provider.prototype.getSupportGeometry = function(){
        
        
    };
        
        
        
    /**
     * return texture of the oriented image
     * @param {type} coWMTS : coord WMTS
     * @returns {WMTS_Provider_L15.WMTS_Provider.prototype@pro;_IoDriver@call;read@call;then}
     */
    OrientedImages_Provider.prototype.getOrientedImageMetaData = function(URLServiceOrientedImages, position)
    {
        
        console.log("getOrientedImageMetaData");
        var batiRGE         = new BatiRGE_Provider();
        Ori.init();
         
        batiRGE.generateMesh(2.3348138,48.8506030,0.002).then(function(geom){
            
            
           
           console.log("geom",geom);


            if(URLServiceOrientedImages === undefined)
                return when(-2);

            var url = "../itowns-sample-data/image200.json";//this.url(URLServiceOrientedImages,position);     


                     //  var texture = this.getTexture(0).then(){};  // URL is urlImages (hardcoded for now)
                     //   var texture = THREE.ImageUtils.loadTexture( this.urlImages());
            var geometrySphere = new THREE.SphereGeometry( 10000000, 16, 16 );
                    //  var geometry = geom;   
                    //   var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: texture} ); 

            // POS
            var ellipsoid  = new Ellipsoid(new THREE.Vector3(6378137, 6356752.3142451793, 6378137));
            var pos = ellipsoid.cartographicToCartesian(new CoordCarto().setFromDegreeGeo(48.85,2.334, 100));


            // Test projective texturing    paris 6: 2.334 48.85

            var p = {filename:"Paris-140616_0740-00-00001_0000482",
                easting:651187.76,northing:6861379.05,altitude:39.39,
                pan_xml_heading_pp:176.117188,pan_xml_roll_pp:0.126007,pan_xml_pitch_pp:1.280821,
                pan_time_utc:"12:31:34.84099999998463"};
            
             // Lon lat p = 2,3348138   48,8506030
             // POS in 3D scene of the panoramic
             var posCarto = new CoordCarto().setFromDegreeGeo(48.8506030,2.3348138, 49.39);
             var posCartesien = ellipsoid.cartographicToCartesian(posCarto);
             
             var spherePosPano = new THREE.Mesh( new THREE.SphereGeometry( 2, 16, 16 ), new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color:0xff00ff}));
             spherePosPano.position.set(posCartesien.x, posCartesien.y, posCartesien.z);
             console.log(posCartesien);
             gfxEngine().add3DScene(spherePosPano);
             
            
            
             var matRotation = new THREE.Matrix4();
             matRotation = Ori.computeMatOriFromHeadingPitchRoll(
                                        p.pan_xml_heading_pp,
                                        p.pan_xml_pitch_pp,
                                        p.pan_xml_roll_pp
                                    );
                            
         
        
            // Then we need to set the rotation with the normal at the center of the pano
    
            
            // Orientation on normal    
                var normal      = ellipsoid.geodeticSurfaceNormalCartographic(posCarto);
                var quaternion  = new THREE.Quaternion();
                quaternion.setFromAxisAngle( new THREE.Vector3(1, 0 ,0 ),0);// Math.PI/2 );
                   
                var child = new THREE.Object3D();
                child.lookAt(new THREE.Vector3().addVectors ( posCartesien.clone(), normal ));
                child.quaternion.multiply(quaternion );                
                //child.position.copy(posCartesien.clone());
                child.updateMatrix();
                
                console.log(gfxEngine().camera.camera3D);
           //     gfxEngine().camera.camera3D.position.set( posCartesien.x ,posCartesien.y, posCartesien.z); 
               
                
                var matRotationGlobe = new THREE.Matrix4().multiplyMatrices(matRotation.clone(),child.matrix);
                matRotation = matRotationGlobe;
                            
            var position = new THREE.Vector4(posCartesien.x, posCartesien.y, posCartesien.z, 1);//new THREE.Vector4(0,0,0,1);
            ProjectiveTexturing2.init(matRotation);
            
            var projectiveMaterial = ProjectiveTexturing2.createShaderForImage(p.filename/*this.panoInfo.filename*/,50);
            ProjectiveTexturing2.changePanoTextureAfterloading("140616/"+p.filename,512,50,position, matRotation,1);
            
            var mat = new THREE.MeshBasicMaterial({color:0xff00ff});
          //  var mesh  = new THREE.Mesh(geometry,mat);
            var mesh  = new THREE.Mesh(geom,mat);//geometrySphere/*geom*/,mat);
       //     mat.side = THREE.DoubleSide;
            mesh.name = "RGE";
            mesh.material = projectiveMaterial;
         //   mesh.material.side = THREE.DoubleSide;  
        //  mesh.material.transparent = true;

       
            var matLambert = new THREE.MeshLambertMaterial({color: 0xff0000, side: 2,  transparent: true, opacity: 0.9});
            var _currentMeshForClickAndGo  = new THREE.Mesh(geom,matLambert);//geometryClickToGo,mat);
        //    gfxEngine().add3DScene(_currentMeshForClickAndGo );
       
         //   mesh.position.set(pos.x, pos.y, pos.z);
            gfxEngine().add3DScene(mesh);
            
            ProjectiveTexturing2.uniforms.RTC = 0;
            
      console.log("ooooooooooooooo");
/*                  
         // RTC computation
         //node.material.setMatrixRTC(this.browserScene.getRTCMatrix(node.position,this.currentCamera()));
         var camera = gfxEngine().camera.camera3D;
         var matRTC = BrowseTree.getRTCMatrix(position, camera);
         console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",matRTC);
         projectiveMaterial.uniforms.RTC = 1;
         projectiveMaterial.uniforms.matRTC = matRTC;
  */   
            // Suppose we got the metadata and image



         /*
            return new Promise(function(resolve, reject) {


               // TODO: USE READ OF IODRIVER JSON (TODO: CREATE IT)
                      var req = new XMLHttpRequest();
                      req.open('GET', url);

                      req.onload = function() {

                            if (req.status === 200) {
                              resolve(JSON.parse(req.response));//req.response);
                            }
                            else {
                              reject(Error(req.statusText));
                            }
                      };

                      req.onerror = function() {
                            reject(Error("Network Error"));
                      };

                      req.send();
                    });
            */

           // Will be done when ImageOriented service will be ok
            /*
            return this._IoDriver.read(url).then(function(result)
                {                                                        
                    if(result !== undefined)
                    {                    
                        result.texture = new THREE.DataTexture(result.floatArray,256,256,THREE.AlphaFormat,THREE.FloatType);   
                        result.texture.generateMipmaps  = false;
                        result.texture.magFilter        = THREE.LinearFilter;
                        result.texture.minFilter        = THREE.LinearFilter;                                    
                        this.cache.addRessource(url,result);
                        return result;
                    }
                    else
                    {
                        var texture = -1;
                        this.cache.addRessource(url,texture);
                        return texture;
                    }
                }.bind(this)
            );
            */

           // We suppose that we have the metadata
       
         }.bind(this));
        
        
    };
    
    

    /**
     * Return texture RGBA THREE.js of orthophoto
     * TODO : RGBA --> RGB remove alpha canal
     * @param {type} coWMTS
     * @param {type} id
     * @returns {WMTS_Provider_L15.WMTS_Provider.prototype@pro;ioDriverImage@call;read@call;then}
     */
    OrientedImages_Provider.prototype.getTexture = function(id)
    {
         
        var pack = function(i)
        {
            this.texture;
            this.id      = i;
        };
        
        var result = new pack(id);
        
        var url = this.urlImages();      
    /*    result.texture  = this.cache.getRessource(url);
        
        if(result.texture !== undefined)
        {                        
            return when(result);
        }   
     */ 
        return this.ioDriverImage.read(url).then(function(image)
        {
            
            result.texture = new THREE.Texture(image);          
            result.texture.generateMipmaps  = false;
            result.texture.magFilter        = THREE.LinearFilter;
            result.texture.minFilter        = THREE.LinearFilter;
            result.texture.anisotropy       = 16;
                        
            this.cache.addRessource(url,result.texture);
            return result;
            
        }.bind(this));
        
    };
    
    return OrientedImages_Provider;
    
});
