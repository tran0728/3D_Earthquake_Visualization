import * as THREE from 'three'
import { EarthquakeRecord } from './EarthquakeRecord';
import { EarthquakeMarker } from './EarthquakeMarker';
import { UVMapping } from 'three';

export class Earth extends THREE.Group
{
    private earthMesh : THREE.Mesh;
    private earthMaterial : THREE.MeshLambertMaterial;
    private debugMaterial : THREE.MeshBasicMaterial;

    constructor()
    {
        // Call the superclass constructor
        super();

        this.earthMesh = new THREE.Mesh();
        this.earthMaterial = new THREE.MeshLambertMaterial();
        this.debugMaterial = new THREE.MeshBasicMaterial();
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
        var vertices = [];
        for(let j = 0; j <= 80; j++) {
            for(let i = 0; i <= 80; i++) {
                vertices.push(x + x_inc*i, y - y_inc*j, 0);
            }
        }
            
        // The normals are always directly outward towards the camera
        var normals = [];
        for(let i = 0; i < 6561; i++) {
            normals.push(0, 0, 1);
        }

        // Next we define indices into the array for the two triangles
        var upper_tri_1 =1;
        var upper_tri_2 =0;
        var upper_tri_3 = 82;
        var lower_tri_1 = 82;
        var lower_tri_2 = 0;
        var lower_tri_3 = 81;
        var indices = [];
        for(let j = 0;j < 40; j++) {
            var extra = j*81;
            for(let i = 0; i < 25; i++) {
                
                //y = v
                //u = x


                indices.push(upper_tri_1+i+extra,upper_tri_2+i+extra,upper_tri_3+i+extra);
                indices.push(lower_tri_1+i+extra,lower_tri_2+i+extra,lower_tri_3+i+extra);

            }
        }
        for(let j = 0;j < 80; j++) {
            var extra = j*81;
            for(let i = 0; i < 80; i++) {
                
                //y = v
                //u = x


                
            }
        }

        // Set the vertex positions in the geometry
        var uv = [];
        var u = 6400
        var v = 6400

        for(let i = 0; i < 80; i++) {
            for(let j = 0; j < 80; j++) {
                 uv.push(.0125*j,1-(.0125*i));
                // uv.push( j / 80,(1-i/80) - 1/80);
                // uv.push( (j+1) / 80,(1-i/80)-1/80);
                // uv.push( (j+1) / 80, (1-(i-1)/80)-1/80);
                // uv.push( j / 80, (1-(i-1)/3)-1/80)
            }

        }
            

        
        // The itemSize is 3 because each item is X, Y, Z
        this.earthMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.earthMesh.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.earthMesh.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

        // Set the triangle indices
        this.earthMesh.geometry.setIndex(indices);

        // Add the mesh to this group
        this.add(this.earthMesh);
    }

    // TO DO: add animations for mesh morphing
    public update(deltaTime: number) : void
    {
        
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
        var position = new THREE.Vector3(Math.random()*6-3, Math.random()*4-2, 0);
        var earthquake = new EarthquakeMarker(position, record, duration);
        this.add(earthquake);
    }

    public convertLatLongToPlane(latitude: number, longitude: number) : THREE.Vector3
    {
        // TO DO: We recommend filling in this function to put all your
        // lat,long --> plane calculations in one place.

        return new THREE.Vector3();
    }

    public convertLatLongToSphere(latitude: number, longitude: number) : THREE.Vector3
    {
        // TO DO: We recommend filling in this function to put all your
        // lat,long --> sphere calculations in one place.

        return new THREE.Vector3();
    }

    public toggleDebugMode(debugMode : boolean)
    {
        if(debugMode)
            this.earthMesh.material = this.debugMaterial;
        else
            this.earthMesh.material = this.earthMaterial;
    }
}