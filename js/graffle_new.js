Raphael.fn.resizeable = function (subject) {
    // Enable method chaining
    if ( subject.resizeable ) { return subject.resizeable; }

    var
        paper = this,
        bbox  = subject.getBBox(true)
        ;
    var rs = subject.rs = {
        subject : subject,
        bbox    : null,
    };
    rs.changeCursor = function(e, mouseX, mouseY){
        
        // Don't change cursor during a drag operation
        if (this.dragging === true) {
            return;
        }
        var canvas = $(this.paper.canvas);
        // X,Y Coordinates relative to shape's orgin
        var relativeX = mouseX - canvas.offset().left - this.attr('x');
        var relativeY = mouseY - canvas.offset().top - this.attr('y');

        var shapeWidth = this.attr('width');
        var shapeHeight = this.attr('height');

        var resizeBorder = 10;

        // Change cursor
        if (relativeX < resizeBorder && relativeY < resizeBorder) { 
            this.model = "resize";
            this.attr('cursor', 'nw-resize');
        } else if (relativeX > shapeWidth-resizeBorder && relativeY < resizeBorder) { 
            this.model = "resize";
            this.attr('cursor', 'ne-resize');
        } else if (relativeX > shapeWidth-resizeBorder && relativeY > shapeHeight-resizeBorder) { 
            this.model = "resize";
            this.attr('cursor', 'se-resize');
        } else if (relativeX < resizeBorder && relativeY > shapeHeight-resizeBorder) { 
            this.model = "resize";
            this.attr('cursor', 'sw-resize');
        } else { 
            this.model = "drag";
            this.attr('cursor', 'move');
        }
    };
    rs.dragStart = function() {
 
        // Save some starting values
        this.ox = this.attr('x');
        this.oy = this.attr('y');
        this.ow = this.attr('width');
        this.oh = this.attr('height');
        this.dragging = true;
    };
    rs.dragMove = function(dx, dy) {
        var attr = {};
        // Inspect cursor to determine which resize/move process to use
        switch (this.attr('cursor')) {
            
            case 'nw-resize' :
                attr.x = this.ox + dx;
                attr.y = this.oy + dy;
                attr.width = this.ow - dx;
                attr.height = this.oh - dy;
                
                break;

            case 'ne-resize' :
                attr.y = this.oy + dy;
                attr.width = this.ow + dx;
                attr.height = this.oh - dy;
                break;

            case 'se-resize' :
                attr.width = this.ow + dx;
                attr.height = this.oh + dy;
                break;

            case 'sw-resize' :
                attr.x = this.ox + dx;
                attr.width = this.ow - dx;
                attr.height = this.oh + dy;
                break;

            default :
                attr.x = this.ox + dx;
                attr.y = this.oy + dy;
                break;
        }
        if (attr.width < 10) {
            attr.width = 10;
        }
        if(attr.height < 10) {
            attr.height = 10;
        }
        this.attr(attr);
    };
    rs.dragEnd = function() {
        this.dragging = false;
    };
    subject.mousemove(rs.changeCursor);
    // Attach "Drag" handlers to rectangle
    subject.drag(rs.dragMove, rs.dragStart, rs.dragEnd);
};

window.onload = function () {
    var r = Raphael("holder", 640, 480),
        connections = [],
        shape1 = r.rect(290, 80, 60, 40, 10),
        shape2 = r.rect(290, 180, 60, 40, 2),
        color = Raphael.getColor();
    shape1.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    shape2.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    r.connection(shape1,shape2,"#fff", "#fff|5");
    r.resizeable(shape1);
    r.resizeable(shape2);
};
