import * as THREE from 'three'
import { EarthquakeRecord } from './EarthquakeRecord';

export class EarthquakeMarker extends THREE.Mesh
{
    public startTime : number;
    public duration : number;
    public magnitude : number;
    public mapPosition : THREE.Vector3;
    public globePosition : THREE.Vector3;
    public position : THREE.Vector3;

    constructor(globePosition : THREE.Vector3, mapPosition : THREE.Vector3, record: EarthquakeRecord, duration : number)
    {
        super();

        this.startTime = record.date.getTime();
        this.magnitude = record.normalizedMagnitude;
        this.duration = duration;
        this.mapPosition = mapPosition;
        this.globePosition = globePosition;
        this.position = mapPosition;

        // Create the sphere geometry
        // Global adjustment of 0.05 to reduce the size
        // You should probably update this be a more meaningful representation of the data
        this.geometry = new THREE.SphereGeometry(0.1*this.magnitude);

        // Initially, the color is set to yellow
        // You should update this to be more a meaningful representation of the data
        var material = new THREE.MeshLambertMaterial();
        material.color = new THREE.Color(1*this.magnitude, 1-this.magnitude, 0);
        this.material = material;
    }

    // This returns a number between 0 (start) and 1 (end)
    getPlaybackLife(currentTime : number) : number
    {
        return THREE.MathUtils.clamp(Math.abs(currentTime/1000 - this.startTime/1000) / this.duration, 0, 1);
    }
}