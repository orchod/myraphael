window.onload = function () {
    var r = Raphael("holder", "100%", "100%"),
        connections = [],
        shape1 = r.rect(290, 80, 60, 40, 10),
        shape2 = r.rect(290, 180, 60, 40, 2),
        color = Raphael.getColor();
    shape1.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    shape2.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    r.connection(shape1,shape2,"#fff", "#fff|5");
    r.resizable(shape1);
    r.resizable(shape2);
};
