/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * A Faire
 * Les tuiles de longitude identique ont le maillage et ne demande pas 1 seule calcul pour la génération du maillage
 * 
 * 
 * 
 * 
 */



define('Core/Commander/Providers/tileGlobeProvider', [
        'when',
        'Core/Geographic/Projection',
        'Core/Commander/Providers/WMTS_Provider',
        'Core/Commander/Providers/KML_Provider',
        'Globe/EllipsoidTileGeometry',
        'Core/Geographic/CoordWMTS',
        'Core/Math/Ellipsoid',
        'Core/defaultValue',
        'Scene/BoundingBox',
        'three'
    ],
    function(
        when,
        Projection,
        WMTS_Provider,
        KML_Provider,
        EllipsoidTileGeometry,
        CoordWMTS,
        Ellipsoid,
        defaultValue,
        BoundingBox,
        THREE
    ) {

        function tileGlobeProvider(size,supportGLInspector) {
            //Constructor

            this.projection = new Projection();
            this.providerWMTS = new WMTS_Provider({support : supportGLInspector});//{url:"http://a.basemaps.cartocdn.com/",layer:"dark_all/"});
            //this.providerWMS     = new WMS_Provider();
            this.ellipsoid = new Ellipsoid(size);
            this.providerKML = new KML_Provider(this.ellipsoid);
            this.cacheGeometry = [];
            this.tree = null;
            this.nNode = 0;

        }

        tileGlobeProvider.prototype.constructor = tileGlobeProvider;

        tileGlobeProvider.prototype.getGeometry = function(bbox, cooWMTS) {
            var geometry = undefined;
            var n = Math.pow(2, cooWMTS.zoom + 1);
            var part = Math.PI * 2.0 / n;

            if (this.cacheGeometry[cooWMTS.zoom] !== undefined && this.cacheGeometry[cooWMTS.zoom][cooWMTS.row] !== undefined) {
                geometry = this.cacheGeometry[cooWMTS.zoom][cooWMTS.row];
            } else {
                if (this.cacheGeometry[cooWMTS.zoom] === undefined)
                    this.cacheGeometry[cooWMTS.zoom] = new Array();

                var precision = 16;
                var rootBBox = new BoundingBox(0, part + part * 0.01, bbox.minCarto.latitude, bbox.maxCarto.latitude);

                geometry = new EllipsoidTileGeometry(rootBBox, precision, this.ellipsoid, cooWMTS.zoom);
                this.cacheGeometry[cooWMTS.zoom][cooWMTS.row] = geometry;

            }

            return geometry;
        };
        
       // tileGlobeProvider.prototype.getKML= function(){
        tileGlobeProvider.prototype.getKML= function(tile){
            if(tile.level  === 16  )
            {
                var longitude   = tile.bbox.center.x / Math.PI * 180 - 180;
                var latitude    = tile.bbox.center.y / Math.PI * 180;

                return this.providerKML.loadKMZ(longitude, latitude).then(function (collada){

                    if(collada && tile.link.children.indexOf(collada) === -1)
                        {                                 
                            tile.link.add(collada);
                            tile.content = collada;
                        }
                }.bind(this));
            }
        };

        tileGlobeProvider.prototype.executeCommand = function(command) {

            var bbox = command.paramsFunction.bbox;
            var cooWMTS = this.projection.WGS84toWMTS(bbox);
            var parent = command.requester;
            var geometry = undefined; //getGeometry(bbox,cooWMTS);       
            var tile = new command.type(bbox, cooWMTS, this.ellipsoid, this.nNode++, geometry,parent.link);

            if (geometry) {
                tile.rotation.set(0, (cooWMTS.col % 2) * (Math.PI * 2.0 / Math.pow(2, cooWMTS.zoom + 1)), 0);
                tile.updateMatrixWorld();
            }

            var translate = new THREE.Vector3();

            if (parent.worldToLocal)
                translate = parent.worldToLocal(tile.absoluteCenter.clone());

            tile.position.copy(translate);            
            tile.setVisibility(false);
  
            parent.add(tile);
            
            tile.updateMatrix();
//            tile.updateMatrixWorld(); // TODO peut pas necessaire
            
//            if(cooWMTS.zoom > 3 )
//                cooWMTS =  undefined;            
//            return this.providerWMTS.getTextureBil(cooWMTS).then(function(terrain){                        
            return this.providerWMTS.getTextureBil(tile.useParent() ? undefined : cooWMTS).then(function(terrain) {
                                                                       
                this.setTerrain(terrain);

                return this;

            }.bind(tile)).then(function(tile) {
                               
                return this.getOrthoImages(tile).then(function(result)
                {                               
                    this.setTexturesLayer(result,1);                        
                                           
                }.bind(tile));
                
            }.bind(this));
        };

        tileGlobeProvider.prototype.getOrthoImages = function(tile) {
                         
            if (tile.cooWMTS.zoom >= 2)
            {
                var promises = [];
                var box = this.projection.WMTS_WGS84ToWMTS_PM(tile.cooWMTS, tile.bbox); //                 
                var col = box[0].col;
                tile.orthoNeed = box[1].row + 1 - box[0].row;               
                
                for (var row = box[0].row; row < box[1].row + 1; row++) {
                                       
                    var cooWMTS = new CoordWMTS(box[0].zoom, row, col);                    
                    var pitch = new THREE.Vector3(0.0,0.0,1.0);
                    
                    if(box[0].zoom > 3)   
                    {
                        var levelParent = tile.getParentNotDownScaled(1).level + 1;                        
                        cooWMTS = this.projection.WMTS_WGS84Parent(cooWMTS,levelParent,pitch);
                    }
                                                            
                    promises.push(this.providerWMTS.getTextureOrtho(cooWMTS,pitch));                 
                }
                  
                return when.all(promises);
            }
            else            
                tile.checkOrtho();
            
        };

        return tileGlobeProvider;

    });
