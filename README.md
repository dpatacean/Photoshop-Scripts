#Photoshop-Scripts

Photoshop scripts used to extend application functionality.

##Resize Layer to Bounding Box in Pixels.jsx

For years Photoshop has been notoriously known for missing an option to use 
pixels when recording a resize action in which a resize was actually performed 
by explicitelly entering a size in pixels. This script aims to help with exactly
that problem by offering a number of ways to perform quick layer resizes in pixels.

It supports user interactive mode in which during every execution the user is 
presented with an option to change values which were set by default. User 
interactive mode is activated and deactivated with the `promptUser` variable.
The meat of the script is however the `resizeToBounds` function which can be 
used separately. Care must be taken in this case that the arguments passed to the 
function MUST(!) adhere to the requested data types.

Additionally the script is capable of performing resizes with constrained proportions
which means that the resized layer will always fit into the given width and height
while keeping the aspect ratio of the original layer. If one of the dimesnions is 
missing constrained proportions will be automatically activated and resizing will 
be performed by using scaling based on the existing dimension. 
 
Most of the code should be self explanatory with comments explaining every step during
the script execution. The script has been tested with `Adobe Photoshop CS6` (both 32-bit 
and 64-bit versions) but if something breaks... Well... Blame the quaggans xD

###Installation

The script can be installed by simply copying it into Photoshop's script folder or executed
directly through `Adobe ExtendScript Toolkit` application.

- **MacOSX:** */Applications/Adobe Photoshop CS6/Presets/Scripts*
- **Windows**: *C:\Program Files\Adobe Photoshop CS6\Presets\Scripts*

