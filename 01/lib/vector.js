"use strict"
const Point3 = require("./point");
class Vector3 extends Point3 {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x = 0, y = 0, z = 1) {
        super(x, y, z);
    }

    length() {
        // sqrt(x^2+y^2+z^2)
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

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @returns {Vector3}
     */
    static add(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @returns {Vector3}
     */
    static subtract(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @returns {Vector3}
     */
    static cross_product(v1, v2) {
        return new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.x * v2.z - v1.z * v2.x,
            v1.x * v2.y - v1.y * v2.x,
        );
    }
    
    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @returns {number}
     */
    static dot_product(v1, v2) {
        return v1.x*v1.x+v1.y*v2.y+v1.z+v2.z;
    }

    /**
     * @param {import("./point")} tail
     * @param {import("./point")} head
     * @returns {Vector3}
     */
    static from(tail, head) {
        return Vector3.subtract(Vector3.from_point(head), Vector3.from_point(tail));
    }

    /**
     * @param {import("./point")} point
     * @returns {Vector3}
     */
    static from_point(point) {
        return new Vector3(point.x, point.y, point.z);
    }
}

module.exports =  Vector3;
