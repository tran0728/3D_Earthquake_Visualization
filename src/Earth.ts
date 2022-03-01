import * as THREE from 'three'
import { EarthquakeRecord } from './EarthquakeRecord';
import { EarthquakeMarker } from './EarthquakeMarker';
import { UVMapping } from 'three';
import { pingpong } from 'three/src/math/MathUtils';

export class Earth extends THREE.Group
{
    public earthMesh : THREE.Mesh;
    public earthMaterial : THREE.MeshLambertMaterial;
    public debugMaterial : THREE.MeshBasicMaterial;
    public vertices : any[];
    public sphere_vertices : any[];
    public normals: any[];
    public sphere_normals: any[];
    public globeMode: Boolean;
    public alpha: number;
    public morph_me: Boolean;



    constructor()
    {
        // Call the superclass constructor
        super();

        this.earthMesh = new THREE.Mesh();
        this.earthMaterial = new THREE.MeshLambertMaterial();
        this.debugMaterial = new THREE.MeshBasicMaterial();
        this.vertices = [];
        this.sphere_vertices = [];
        this.normals = [];
        this.sphere_normals = [];
        this.globeMode = false;
        this.alpha = 0;
        this.morph_me = false;
    }

    public initialize() : void
    {
        // Initialize texture: you can change to a lower-res texture here if needed
        // Note that this won't display properly until you assign texture coordinates to the mesh
        this.earthMaterial.map = new THREE.TextureLoader().load('./data/earth-1k.png');
        this.earthMaterial.map.minFilter = THREE.LinearFilter;

        this.earthMesh.material = this.earthMaterial;

        // Setup the debug material for wireframe viewing
        this.debugMaterial.wireframe = true;

        var x = -Math.PI;
        var y = Math.PI/2;

        var x_inc = (2*Math.PI)/80;
        var y_inc = Math.PI/80;
        var num_vert = 0;

        // Setting vertices
        var scale = Math.PI/180
        var indices = [];

        for(let i = 0; i < 80; i++) {
            for(let j = 0; j < 80; j++) {
                this.vertices.push(x + x_inc*j, y - i*y_inc,0) 
                this.vertices.push(x + x_inc + x_inc * j, y - i*y_inc,0)
                this.vertices.push(x + x_inc+x_inc * j, y +y_inc - i * y_inc, 0)
                this.vertices.push(x + x_inc*j, y +y_inc - y_inc*i, 0);

                this.normals.push(0, 0, 1);
                this.normals.push(0, 0, 1);
                this.normals.push(0, 0, 1);
                this.normals.push(0, 0, 1);

            }
        }

        for(let i = 0; i<80; i++) {
            for(let j=0; j<80; j++){
                var longitude_1 = this.rescale(x + x_inc*j, 0, Math.PI, 0, 180);
                var latitude_1 = this.rescale(y - i*y_inc, 0, Math.PI/2, 0, 90);
                var longitude_2 = this.rescale(x + x_inc + x_inc * j, 0, Math.PI, 0, 180);
                var latitude_2 = this.rescale(y - i*y_inc, 0, Math.PI/2, 0, 90);
                var longitude_3 = this.rescale(x + x_inc+x_inc * j, 0, Math.PI, 0, 180);
                var latitude_3 = this.rescale(y +y_inc - i * y_inc, 0, Math.PI/2, 0, 90);
                var longitude_4 = this.rescale(x + x_inc*j, 0, Math.PI, 0, 180);
                var latitude_4 = this.rescale(y +y_inc - y_inc*i, 0, Math.PI/2, 0, 90);

                var sphere_vertex1 = this.convertLatLongToSphere(latitude_1,longitude_1);
                var sphere_vertex2 = this.convertLatLongToSphere(latitude_2,longitude_2);
                var sphere_vertex3 = this.convertLatLongToSphere(latitude_3,longitude_3);
                var sphere_vertex4 = this.convertLatLongToSphere(latitude_4,longitude_4);

                this.sphere_vertices.push(sphere_vertex1.x, sphere_vertex1.y, sphere_vertex1.z);
                this.sphere_vertices.push(sphere_vertex2.x, sphere_vertex2.y, sphere_vertex2.z);
                this.sphere_vertices.push(sphere_vertex3.x, sphere_vertex3.y, sphere_vertex3.z);
                this.sphere_vertices.push(sphere_vertex4.x, sphere_vertex4.y, sphere_vertex4.z);

                this.sphere_normals.push(sphere_vertex1.x, sphere_vertex1.y, sphere_vertex1.z);
                this.sphere_normals.push(sphere_vertex2.x, sphere_vertex2.y, sphere_vertex2.z);
                this.sphere_normals.push(sphere_vertex3.x, sphere_vertex3.y, sphere_vertex3.z);
                this.sphere_normals.push(sphere_vertex4.x, sphere_vertex4.y, sphere_vertex4.z);


            }
        }

        // for(let j = 0; j <= 80; j++) {
        //     for(let i = 0; i <= 80; i++) {
        //         // var x_sphere = Math.sin(Math.PI * j/80)*Math.cos(2*Math.PI * i/80);
        //         // var y_sphere = Math.sin(Math.PI * j/80)*Math.sin(2*Math.PI * i/80);
        //         // var z_sphere = Math.cos(Math.PI * j/80);
        //         this.sphere_vertices.push(x_sphere,y_sphere,z_sphere);
        //     }
        // }
        for(let i = 0; i < 80; i++) {
            for(let j = 0; j < 80; j++) {
                indices.push(num_vert * 4 + 1,num_vert*4+3, num_vert*4);
                indices.push(num_vert *4 + 1, num_vert *4+2, num_vert *4+3);
                num_vert++;
            }
        }
        // The normals are always directly outward towards the camera


        // Next we define indices into the array for the two triangles

        // Set the vertex positions in the geometry
        var uv = [];
        for(let i = 0; i < 80; i++) {
            for(let j = 0; j < 80; j++) {
                //  uv.push(.0125*j,1-(.0125*i));
                 uv.push( j/80, 1- i / 80);
                 uv.push((j+1)/80, 1-i/80);
                 uv.push((j+1)/80, 1-(i-1)/80);
                 uv.push(j/80, 1-(i-1)/80);
            }

        }
            

        
        // The itemSize is 3 because each item is X, Y, Z
        this.earthMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
        this.earthMesh.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));
        this.earthMesh.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

        // Set the triangle indices
        this.earthMesh.geometry.setIndex(indices);

        // Add the mesh to this group
        this.add(this.earthMesh);
    }

    public rescale(x: number, xmin: number, xmax: number, ymin: number, ymax: number) : number {
        return ymin + (ymax - ymin) * (x - xmin) / (xmax - xmin);
    }

    // TO DO: add animations for mesh morphing
    public update(deltaTime: number) : void
    {
        if(this.morph_me){
            this.morph(deltaTime);
        }

    }

    public morph(deltaTime: number) : void {
        this.alpha += deltaTime;
        if(this.alpha > 1) {
            this.morph_me = false;
            this.alpha = 0;
            return;
        }
        var normals_array = [];
        var vectors_array = [];
        if(this.globeMode == true){
            for(let i = 0; i < 6400*15; i++) {
                vectors_array.push(THREE.MathUtils.lerp(this.vertices[i], this.sphere_vertices[i], this.alpha));
                normals_array.push(THREE.MathUtils.lerp(this.normals[i], this.sphere_normals[i], this.alpha));
            }
        }
        if(this.globeMode == false) {
            for(let i = 0; i < 6400*15; i++) {
                vectors_array.push(THREE.MathUtils.lerp(this.sphere_vertices[i], this.vertices[i], this.alpha));
                normals_array.push(THREE.MathUtils.lerp(this.sphere_normals[i], this.normals[i], this.alpha));
            }
        }
        this.earthMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vectors_array, 3));
        this.earthMesh.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals_array, 3));
        


    }

    public animateEarthquakes(currentTime : number)
    {
        // This code removes earthquake markers after their life has expired
        this.children.forEach((quake : THREE.Object3D) => {
            if(quake instanceof EarthquakeMarker)
            {
                if(this.morph_me) {
                    if(this.globeMode == true){
                        quake.position.lerpVectors(quake.mapPosition, quake.globePosition, this.alpha);
                    }
                    if(this.globeMode == false){
                        quake.position.lerpVectors(quake.globePosition, quake.mapPosition, this.alpha);
                    }
                }
                if(!this.morph_me) {
                    if(this.globeMode == true) {
                        quake.position = quake.globePosition;
                    }
                    if(this.globeMode == false){
                        quake.position = quake.mapPosition;
                    }
                }
                
                if(quake.getPlaybackLife(currentTime) == 1)
                    this.remove(quake);
            }
        });
    } 

    public createEarthquake(record : EarthquakeRecord)
    {
        // Number of milliseconds in 1 year (approx.)
        const duration = 12 * 28 * 24 * 60 * 60;

        // TO DO: currently, the earthquake is just placed randomly on the plane
        // You will need to update this code to calculate both the map and globe positions
        
            var globePosition = this.convertLatLongToSphere(record.latitude, record.longitude);
        
        
            
            var mapPosition = this.convertLatLongToPlane(record.latitude,record.longitude);
        
        
        var earthquake = new EarthquakeMarker(globePosition, mapPosition, record, duration);
        this.add(earthquake);
    }

    public convertLatLongToPlane(latitude: number, longitude: number) : THREE.Vector3
    {
        // TO DO: We recommend filling in this function to put all your
        // lat,long --> plane calculations in one place.
        
        //x goes (-Pi,Pi)
        //y goes (-Pi/2, Pi/2)
        //lat (-90, 90) corresponds to y
        //long( -180, 180) corresponds to x
        var scaled_lat = latitude/90;
        var scaled_long = longitude/180;
        var x = scaled_long * Math.PI;
        var y = scaled_lat * (Math.PI/2);

        return new THREE.Vector3(x, y, 0);
    }

    public convertLatLongToSphere(latitude: number, longitude: number) : THREE.Vector3
    {
        // TO DO: We recommend filling in this function to put all your
        // lat,long --> sphere calculations in one place.
        var lat_rad = latitude * Math.PI/180;
        var long_rad = longitude * Math.PI/180;
        var x = Math.cos(lat_rad) * Math.sin(long_rad);
        var y = Math.sin(lat_rad);
        var z = Math.cos(lat_rad) * Math.cos(long_rad);
        return new THREE.Vector3(x,y,z);
    }

    public toggleDebugMode(debugMode : boolean)
    {
        if(debugMode)
            this.earthMesh.material = this.debugMaterial;
        else
            this.earthMesh.material = this.earthMaterial;
    }
}