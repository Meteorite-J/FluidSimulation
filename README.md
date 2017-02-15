#### 3D Real-time Liquid Simulation

## Abstract

Liquid is a GPU implementation of the PIC/FLIP method (with various additions) using WebGL that simulates and renders fluid in 3D. PIC/FLIP has more or less become the standard method for fluid simulation in the computer graphics industry. Houdini and Naiad both use PIC/FLIP implementations as their core fluid solvers, and Double Negative’s in-house simulator is also a PIC/FLIP implementation. This project aims to demonstrate this legacy method and with my own tweaks.  

## Particle rendering

PIC/FLIP is a particle based method. It is similar to SPH in that it’s fundamentally a particle based method, but instead of attempting to use external forces to maintain fluid volume, PIC/FLIP splats particle velocities onto a grid, calculates a velocity field using a projection step, and then copies the new velocities back onto the particles for each step. This difference means PIC/FLIP doesn’t suffer from the volume conservation problems SPH has. In this sense, PIC/FLIP can almost be thought of as a hybridization of SPH and semi-Lagrangian level-set based methods. This project will render the particles with spherical ambient occlusion volumes.

## References

Animating Sand as a Fluid - Zhu, Bridson
Fluid Simulation for Computer Graphics - Robert Bridson
[Mozilla WebGL Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
