import { Point3 } from "./point";

export default class Vector3 extends Point3 {
    constructor(x = 0, y = 0, z = 1) {
        super(x, y, z);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };


    normalize() {
        let length = this.length();
        if (Math.abs(length) < 0.0000001) {
            return null;
        }

        const percent = 1.0 / length;
        const normalized = new Vector3();
        normalized.x = this.x * percent;
        normalized.y = this.y * percent;
        normalized.z = this.z * percent;
        return normalized;
    };

    static add(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    static subtract(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    static cross_product(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.x * v2.z - v1.z * v2.x,
            v1.x * v2.y - v1.y * v2.x,
        );
    }
    
    static dot_product(v1: Vector3, v2: Vector3): number {
        return v1.x*v1.x+v1.y*v2.y+v1.z+v2.z;
    }

    static from(tail: Point3, head: Point3): Vector3 {
        return Vector3.subtract(Vector3.from_point(head), Vector3.from_point(tail));
    }

    static from_point(point: Point3) {
        return new Vector3(point.x, point.y, point.z);
    }
}
