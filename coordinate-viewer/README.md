# Coordinate Viewer

This application has to be integrated into the Hippocampus Hub.

* **frontend/**: The web application to integrate. It shows the three coordinates for the hippocampus.
* **scripts/**: Converts a NRRD file with the coordinates in data that can be displayed in `frontend/`.

If you execute `npm run start` in `scripts/`, it will take
`scripts/data/coordinates.nrrd` and `scripts/data/mesh.obj` and generate these three files:

* `frontend/public/data/mesh.json`: bounding box of the mesh.
* `frontend/public/data/elem.dat`: indexes of the vertices uses in all the triangles to paint.
* `frontend/public/data/vert.dat`: attributes of the vertices.
