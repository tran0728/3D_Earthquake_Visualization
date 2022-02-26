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

        // Setting vertices
        var scale = Math.PI/180

        for(let j = 0; j <= 80; j++) {
            for(let i = 0; i <= 80; i++) {
                this.vertices.push(x + x_inc*i, y - y_inc*j, 0);
            }
        }

        for (let i = 0; i < 6561*3; i=i+3) {
            var ver_x = this.vertices[i]
            var ver_y = this.vertices[i+1]

            var longitude = this.rescale(ver_x, -Math.PI, Math.PI, -180, 180) * Math.PI/180;
            var latitude = this.rescale(ver_y, (-Math.PI/2), (Math.PI/2), -90, 90) * Math.PI/180;

            var x_sphere = Math.cos(latitude) * Math.sin(longitude);
            var y_sphere = Math.sin(latitude);
            var z_sphere = Math.cos(latitude) * Math.cos(longitude);
            this.sphere_vertices.push(x_sphere,y_sphere,z_sphere);
        }
        // for(let j = 0; j <= 80; j++) {
        //     for(let i = 0; i <= 80; i++) {
        //         // var x_sphere = Math.sin(Math.PI * j/80)*Math.cos(2*Math.PI * i/80);
        //         // var y_sphere = Math.sin(Math.PI * j/80)*Math.sin(2*Math.PI * i/80);
        //         // var z_sphere = Math.cos(Math.PI * j/80);
        //         this.sphere_vertices.push(x_sphere,y_sphere,z_sphere);
        //     }
        // }
            
        // The normals are always directly outward towards the camera

        for(let i = 0; i < 6561; i++) {
            this.normals.push(0, 0, 1);
        }
        var sphere_normals = [];
        for(let i = 0; i < 6561; i++) {
            this.sphere_normals.push(this.sphere_vertices[i]);
        }

        // Next we define indices into the array for the two triangles
        var upper_tri_1 =1;
        var upper_tri_2 =0;
        var upper_tri_3 = 82;
        var lower_tri_1 = 82;
        var lower_tri_2 = 0;
        var lower_tri_3 = 81;
        var indices = [];
        var sphere_indices = [];
        for(let j = 0;j < 80; j++) {
            var extra = j*81;
            for(let i = 0; i < 80; i++) {
                indices.push(upper_tri_1+i+extra,upper_tri_2+i+extra,upper_tri_3+i+extra);
                indices.push(lower_tri_1+i+extra,lower_tri_2+i+extra,lower_tri_3+i+extra);
                sphere_indices.push(upper_tri_1+i+extra,upper_tri_2+i+extra,upper_tri_3+i+extra);
                sphere_indices.push(lower_tri_1+i+extra,lower_tri_2+i+extra,lower_tri_3+i+extra);
            }
        }

        // Set the vertex positions in the geometry
        var uv = [];
        var uv_spheres = [];
        for(let i = 0; i <= 80; i++) {
            for(let j = 0; j <= 80; j++) {
                 uv.push(.0125*j,1-(.0125*i));
                 uv_spheres.push(.0125*j,1-(.0125*i));
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
            for(let i = 0; i < 6561; i++) {
                vectors_array.push(THREE.MathUtils.lerp(this.vertices[i], this.sphere_vertices[i], this.alpha));
                normals_array.push(THREE.MathUtils.lerp(this.normals[i], this.sphere_normals[i], this.alpha));
            }
        }
        if(this.globeMode == false) {
            for(let i = 0; i < 6561; i++) {
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
        if(this.globeMode) {
            var position = this.convertLatLongToSphere(record.latitude, record.longitude);
        }
        else {
            
            var position = this.convertLatLongToPlane(record.latitude,record.longitude);
        }
        
        var earthquake = new EarthquakeMarker(position, record, duration);
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