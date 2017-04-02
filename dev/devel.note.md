# Devel Note

## Fixed & Modified

### iScroll

#### Adding smooth animation effect to wheel zoom

Line 1311 : this.zoom(deltaScale, e.pageX, e.pageY, 0); from 0 to 450
Under : '_wheelZoom: function (e) {'

#### to get margin if it's smaller than viewport

##### using inital zoom 
The proper value is not yet promised. (not good idea)
```
startZoom: 1.00043,
zoomMin: 1.00043, 
```
##### using adding more margin
100% + 1px margin for height and width


