/**
 * connection two obj
 * example: 
 * var r = Raphael("holder", 640, 480),
 * 		connections = [],
 * 		shape1 = r.rect(290, 80, 60, 40, 10),
 * 		shape2 = r.rect(290, 180, 60, 40, 2),
 * 		color = Raphael.getColor();
 * shape1.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
 * shape2.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
 * r.connection(shape1,shape2,"#fff", "#fff|5")
 *       
 */
Raphael.fn.connection = function (obj1, obj2, line, bg) {

	var paper = this,
	move = function(){
		paper.connection(paper.connectioned);
        paper.safari();
	},
	dragger = function(){
        this.animate({"fill-opacity": .2}, 500);
	},
	up = function(){
		this.animate({"fill-opacity": 0}, 500);
	};
	if (!this.bindDraged) {
		obj1.drag(move, dragger, up);
		obj2.drag(move, dragger, up);
		this.bindDraged = true;
	};
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        this.connectioned = {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
        return this.connectioned;
    }
};
/**
 * [resizable description]
 * @param  {[type]} subject [description]
 * @return {[type]}         [description]
 */
Raphael.fn.resizable = function (subject) {
    // Enable method chaining
    if ( subject.resizable ) { return subject.resizable; }

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
    return subject;
};