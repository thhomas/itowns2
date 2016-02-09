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
                THREE,      
                Ori,
                CacheRessource,
                ProjectiveTexturing2){
                    
                    
                   var  _projectiveMaterial = null,
                        _mesh = null,
                        _geometry = null,
                        _pivot = null;

                
    function OrientedImages_Provider()
    {
        //Constructor
 
     //   Provider.call(this, new IoDriver_Image()); // Should be JSON
     //   this.cache         = CacheRessource();        
        this.ioDriverImage = new IoDriver_Image();
        this.ioDriverXML = new IoDriverXML();
       
    }

//    OrientedImages_Provider.prototype = Object.create( Provider.prototype );
//    OrientedImages_Provider.prototype.constructor = OrientedImages_Provider;
    
  
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
        
    /*
   OrientedImages_Provider.prototype.initOri = function(){

        Ori.init();
        OrientedImages_Provider.prototype.testInitOri();
   };     
        
        
    OrientedImages_Provider.prototype.testInitOri = function() {
        
        console.log("testinitOri");
        
        if (Ori.initiated){ console.log("init ori ok");
             OrientedImages_Provider.prototype.getOrientedImageMetaData();
        }
        else {
             setTimeout(OrientedImages_Provider.prototype.testInitOri, 300);  // !! scope
        }
        
    };
        
        */
    /**
     * return texture of the oriented image
     * @param {type} coWMTS : coord WMTS
     * @returns {WMTS_Provider_L15.WMTS_Provider.prototype@pro;_IoDriver@call;read@call;then}
     */
    OrientedImages_Provider.prototype.getOrientedImageMetaData = function(URLServiceOrientedImages, position)
    {
        Ori.init();
        console.log("getOrientedImageMetaData");
        var batiRGE         = new BatiRGE_Provider();
        var RTC_ON = true; //false;
        
        batiRGE.generateMesh(2.3348138,48.8506030,0.0025, RTC_ON).then(function(geometry){
 
            var geom = geometry.geometry;
            _geometry = geometry.geometry;
            _pivot = geometry.pivot;
            
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
            //var pos = ellipsoid.cartographicToCartesian(new CoordCarto().setFromDegreeGeo(48.85,2.334, 100));

            // Test projective texturing    paris 6: 2.334 48.85
            var p = {filename:"Paris-140616_0740-00-00001_0000482",
                easting:651187.76,northing:6861379.05,altitude:39.39,
                pan_xml_heading_pp:176.117188,pan_xml_roll_pp:0.126007,pan_xml_pitch_pp:1.280821,
                pan_time_utc:"12:31:34.84099999998463"};
            
           var p2 = {filename:"Paris-140616_0740-00-00001_0000483",
               easting:651187.63,northing:6861376.21,altitude:39.43,
               pan_xml_heading_pp:182.681473,pan_xml_roll_pp:0.251712,pan_xml_pitch_pp:1.253257,
               pan_time_utc:"12:31:35.59099999998395"};
            // P2 2,3348124 48,8505774
            // 
             // Lon lat p = 2,3348138   48,8506030
             // POS in 3D scene of the panoramic
             var posCarto = new CoordCarto().setFromDegreeGeo(48.8506030,2.3348138, 49.39);
             var posCartesien = ellipsoid.cartographicToCartesian(posCarto);
             var posCarto2 = new CoordCarto().setFromDegreeGeo(48,8505774, 2,3348124, 49.43);
             var posCartesien2 = ellipsoid.cartographicToCartesian(posCarto2);
             
             var spherePosPano = new THREE.Mesh( new THREE.SphereGeometry( 0.5, 16, 16 ), new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color:0xff00ff}));
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
            quaternion.setFromAxisAngle( new THREE.Vector3(1, 0 ,0 ), Math.PI/2 );

            var child = new THREE.Object3D();
            var localTarget = new THREE.Vector3().addVectors ( posCartesien.clone(), normal );
            child.lookAt(localTarget);
            child.quaternion.multiply(quaternion );                
            //child.position.copy(posCartesien.clone());
            child.updateMatrix();
            console.log("MAtrice normale",child.matrix, "normal vec", normal );

            var matRotationGlobe = new THREE.Matrix4().multiplyMatrices(matRotation.clone(),child.matrix);
            matRotation = matRotationGlobe;
                                                           
            var position = new THREE.Vector3(posCartesien.x, posCartesien.y, posCartesien.z); 
            var posPiv = position.clone().sub(geometry.pivot);
            var positionOriginale = new THREE.Vector4(posCartesien.x, posCartesien.y, posCartesien.z, 1.);
            var positionCamWithPivot = RTC_ON  ? new THREE.Vector4(posPiv.x, posPiv.y, posPiv.z, 1.) : positionOriginale;
            console.log("positionCamWithPivot ",positionCamWithPivot);
            // console.log("positionCamWithPivot ",positionCamWithPivot, positionCamWithoutPivot);
            ProjectiveTexturing2.init(matRotation);
            _projectiveMaterial = ProjectiveTexturing2.createShaderForImage(p.filename/*this.panoInfo.filename*/,50);
            ProjectiveTexturing2.changePanoTextureAfterloading("140616/"+p.filename,512,50, positionCamWithPivot, matRotation, 1);
            
            var mat = new THREE.MeshBasicMaterial({color:0xff00ff});
                                                    //  var mesh  = new THREE.Mesh(geometry,mat);
            _mesh  = new THREE.Mesh(geom,mat); //new THREE.Mesh(geometrySphere,mat); //new THREE.Mesh(geom,mat);
            _mesh.name = "RGE";
            _mesh.material = _projectiveMaterial;
            _mesh.material.transparent = false;
            _mesh.material.side = THREE.DoubleSide;  
            _mesh.visible = true;  
            //_mesh.material.uniforms.mobileOn.value = 1;
            
            var dist = new THREE.Vector3(0,10000,0);//position.clone().sub(gfxEngine().camera.camera3D.position.clone());
            console.log("dist",dist);
                    
            if(RTC_ON){
               
                _mesh.position.set(geometry.pivot.x, geometry.pivot.y, geometry.pivot.z);
                _mesh.material.uniforms.RTC.value = 1;
                OrientedImages_Provider.computeRTC2(geometry.pivot, gfxEngine().camera, _mesh, position, dist );
            }
          
          gfxEngine().scene3D.add(_mesh);
          
       //   gfxEngine().camera.camera3D.position.set( posCartesien.x ,posCartesien.y, posCartesien.z); 
        //  gfxEngine().camera.camera3D.lookAt(new THREE.Vector4(posCartesien.x+100, posCartesien.y + 100, posCartesien.z, 1.));
         // gfxEngine().camera.camera3D.fov = 100;
       //    gfxEngine().camera.camera3D.up.set(normal.x,normal.y,normal.z);
           
         }.bind(this));
        
        
    };
    
    
    OrientedImages_Provider.prototype.navigate = function(){
        

            var RTC_ON = true;
            var p = {filename:"Paris-140616_0740-00-00001_0000483",
               easting:651187.63,northing:6861376.21,altitude:39.43,
               pan_xml_heading_pp:182.681473,pan_xml_roll_pp:0.251712,pan_xml_pitch_pp:1.253257,
               pan_time_utc:"12:31:35.59099999998395"};
            // P 2,3348124 48,8505774
            
             // Lon lat p = 2,3348138   48,8506030
             // POS in 3D scene of the panoramic
             var posCarto = new CoordCarto().setFromDegreeGeo(48.8505774, 2.3348124, 49.43);
             var ellipsoid  = new Ellipsoid(new THREE.Vector3(6378137, 6356752.3142451793, 6378137));
             var posCartesien = ellipsoid.cartographicToCartesian(posCarto);

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
            quaternion.setFromAxisAngle( new THREE.Vector3(1, 0 ,0 ), Math.PI/2 );

            var child = new THREE.Object3D();
            var localTarget = new THREE.Vector3().addVectors ( posCartesien.clone(), normal );
            child.lookAt(localTarget);
            child.quaternion.multiply(quaternion );                
            child.updateMatrix();

            var matRotationGlobe = new THREE.Matrix4().multiplyMatrices(matRotation.clone(),child.matrix);
            matRotation = matRotationGlobe;
                                                           
            var position = new THREE.Vector3(posCartesien.x, posCartesien.y, posCartesien.z); 
            var posPiv = position.clone().sub(_pivot.clone());
            var positionOriginale = new THREE.Vector4(posCartesien.x, posCartesien.y, posCartesien.z, 1.);
            var positionCamWithPivot = RTC_ON  ? new THREE.Vector4(posPiv.x, posPiv.y, posPiv.z, 1.) : positionOriginale;

            console.log("positionCamWithPivot ",positionCamWithPivot, "pivo",_pivot);
            ProjectiveTexturing2.changePanoTextureAfterloading("140616/"+p.filename,512,50, positionCamWithPivot, matRotation, 1);
            
            //gfxEngine().camera.camera3D.position.set( posCartesien.x, posCartesien.y, posCartesien.z);
            OrientedImages_Provider.smoothTransition(posCartesien);

    };
    
    OrientedImages_Provider.smoothTransition = function(pos, lastPos){
        
       var speedMove = 0.1; 
       var currentPos = gfxEngine().camera.camera3D.position.clone();
        
      // var newPos =  currentPos.sub(pos.clone());
       var posx = currentPos.x + (pos.x - currentPos.x) * speedMove;
       var posy = currentPos.y + (pos.y - currentPos.y) * speedMove;
       var posz = currentPos.z + (pos.z - currentPos.z) * speedMove;
       
       gfxEngine().camera.camera3D.position.set( posx, posy, posz);
       var vCurrent = new THREE.Vector3(posx, posy, posz);
       //console.log(posx,posy, posz);
       //requestAnimSelectionAlpha(OrientedImages_Provider.smoothTransition(pos,new THREE.Vector3(posx, posy, posz)));
       
       if(vCurrent.distanceTo(pos) > 0.02)
          setTimeout(function(){OrientedImages_Provider.smoothTransition(pos, vCurrent);}, 20);
    };
    
        // Super dirty (temp for local test)
    OrientedImages_Provider.computeRTC2 = function(center, camera, mesh, pos, dist){

             var position    = new THREE.Vector3().subVectors(camera.camera3D.position,center);
             var quaternion  = new THREE.Quaternion().copy(camera.camera3D.quaternion);        
             var matrix      = new THREE.Matrix4().compose(position,quaternion,new THREE.Vector3(1,1,1));
             var matrixInv   = new THREE.Matrix4().getInverse(matrix);       
             var centerEye   = new THREE.Vector4().applyMatrix4(matrixInv) ;                        
             var mvc         = matrixInv.setPosition(centerEye);      
             var matRTC      = new THREE.Matrix4().multiplyMatrices(camera.camera3D.projectionMatrix,mvc);
             mesh.material.uniforms.mVPMatRTC.value = matRTC;
             

          //   var posCam = gfxEngine().camera.camera3D.position;

        //     gfxEngine().camera.camera3D.position.set( pos.x + Math.abs(pos.x - posCam)/100 , pos.y + Math.abs(pos.y - posCam)/100, pos.z + Math.abs(pos.z - posCam)/100);
          //  gfxEngine().camera.camera3D.rotation.y += 0.001;
          //   gfxEngine().renderScene(); 
             setTimeout(function(){OrientedImages_Provider.computeRTC2(center, camera, mesh, pos, new THREE.Vector3(dist.x/1.01,dist.y/1.01,dist.z/1.01));}, 6);//1000/60); //OrientedImages_Provider.computeRTC2(center, camera, mesh)
    };


    OrientedImages_Provider.computeRTC = function(center, camera){
        
        
        console.log("computeRTC");
            // TODO gerer orientation et echelle de l'objet
        var position    = new THREE.Vector3().subVectors(camera.camera3D.position,center);
        var quaternion  = new THREE.Quaternion().copy(camera.camera3D.quaternion);        
        var matrix      = new THREE.Matrix4().compose(position,quaternion,new THREE.Vector3(1,1,1));
        var matrixInv   = new THREE.Matrix4().getInverse(matrix);       
        var centerEye   = new THREE.Vector4().applyMatrix4(matrixInv) ;                        
        var mvc         = matrixInv.setPosition(centerEye);      
        return            new THREE.Matrix4().multiplyMatrices(camera.camera3D.projectionMatrix,mvc);
    }

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
