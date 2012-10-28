var PetalGeometry = module.exports = function() {
  THREE.Geometry.call(this);

  this.data = {
      lengths: []
    , widths: []
  };

  var i
    , interval = 1/40
    , length = 550
    , n = 0
    , l = 1

  for (i = 0; i < l; i += interval) {
    this.vertices.push(new THREE.Vector3(
      i * length, 0, 0
    ));
    this.vertices.push(new THREE.Vector3(
      i * length, 0, 0
    ));
    this.vertices.push(new THREE.Vector3(
      i * length, 0, 0
    ));
    this.data.lengths.push(i, i, i);
    this.data.widths.push(-1, 0, 1);

    if (n % 1) {
      this.faces.push(new THREE.Face4(
          this.vertices.length - 1
        , this.vertices.length - 2
        , this.vertices.length - 5
        , this.vertices.length - 4
      ));
      this.faces.push(new THREE.Face4(
          this.vertices.length - 2
        , this.vertices.length - 3
        , this.vertices.length - 6
        , this.vertices.length - 5
      ));
      this.faces.push(new THREE.Face4(
          this.vertices.length - 4
        , this.vertices.length - 5
        , this.vertices.length - 2
        , this.vertices.length - 1
      ));
      this.faces.push(new THREE.Face4(
          this.vertices.length - 5
        , this.vertices.length - 6
        , this.vertices.length - 3
        , this.vertices.length - 2
      ));

      if (n <= 0.5) {
        continue;
      }

      this.faces.push(new THREE.Face4(
          this.vertices.length - 4
        , this.vertices.length - 5
        , this.vertices.length - 8
        , this.vertices.length - 7
      ));
      this.faces.push(new THREE.Face4(
          this.vertices.length - 5
        , this.vertices.length - 6
        , this.vertices.length - 9
        , this.vertices.length - 8
      ));
      this.faces.push(new THREE.Face4(
          this.vertices.length - 7
        , this.vertices.length - 8
        , this.vertices.length - 5
        , this.vertices.length - 4
      ));
      this.faces.push(new THREE.Face4(
          this.vertices.length - 8
        , this.vertices.length - 9
        , this.vertices.length - 6
        , this.vertices.length - 5
      ));
    }
    n += 0.5;
  }

  this.computeBoundingSphere();
  this.computeBoundingBox();
  this.computeCentroids();
  this.computeFaceNormals();
};

PetalGeometry.prototype = Object.create( THREE.Geometry.prototype );