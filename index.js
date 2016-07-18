
var Py		= require('pythonify');
var fill	= require('populater');

// In order to sort objects they must be Array's.  
//
// var Order		= SupremeOrder(config);
// Order(data);
// 
// for (var i in data.SupremeOrder.Array) {
//     var item		= data.SupremeOrder.Array[i];
//     item.ordering;
// };
// 
// var item		= data.SupremeOrder.Array[0];
// item.down();
// item.children();
//

function SupremeOrder(data, opts) {
    // if (!(this instanceof SupremeOrder))
    // 	return new SupremeOrder(data, opts);
    opts.children	= opts.children || 'items';
    opts.orderKey	= opts.orderKey || 'order';
    opts.onreorder	= opts.onreorder || function() {};
    opts.depth		= opts.depth || 0;
    
    if (typeof data !== 'object' || data === null)
	throw Error(fill("First argument cannot be {{type}}, must be of type Object.", {
	    "type": data === null ? 'null' : 'of type '+typeof data
	}));

    function SupremeData(index) {
	var item		= SupremeData.Array[index];
	if (typeof opts.children === 'function')
	    var children	= opts.children(item);
	else
	    var children	= item[opts.children];
	return SupremeItem( SupremeData.Array, index, children, opts, SupremeData);
    }
    SupremeData.onreorder	= opts.onreorder;
    SupremeData.src		= data;
    if (!Array.isArray(data))
	data			= Py(data).values();
    SupremeData.Array		= [];
    SupremeData.Array.push.apply(SupremeData.Array, data);
    SupremeData.Array.sort(SupremeSort(opts.orderKey));
    SupremeData.get		= function(i) {
	return SupremeData.Array[i];
    }

    return SupremeData;
    // Object.defineProperty(this, 'SupremeOrder', {
    // 	value: function(index) {
    // 	    return SupremeItem(this, index);
    // 	}
    // });
}

function SupremeItem(data, index, children, opts, SupremeData) {
    if (!(this instanceof SupremeItem))
	return new SupremeItem(data, index, children, opts, SupremeData);
    
    this.opts		= opts;
    this.data		= data; // is always an Array
    this.index		= parseInt(index);
    this.item		= this.data[this.index];
    this.depth		= opts.depth;
    this.childs		= children;
    var opts		= Py(this.opts).copy();
    opts.depth++;
    this.subNodes	= SupremeOrder(children || [], opts);
    this.SupremeData	= SupremeData;
}
SupremeItem.prototype.src = function() {
    return this.item;
};
SupremeItem.prototype.children = function() {
    var opts		= Py(this.opts).copy();
    opts.depth++;
    return SupremeOrder(this.childs, opts);
};
SupremeItem.prototype.up = function(c, swap) {
    c		= c === undefined ? this.depth : c;
    swap	= swap === false ? false : true;

    moveUp(this.item, this.opts.orderKey, c);

    for (var i in this.subNodes.Array) {
	var node	= this.subNodes(i);
	node.up(c, false);
    }

    if (swap) {
	this.SupremeData.onreorder(this.item);
	
	var previous	= this.SupremeData(this.index-1);
	previous.down(c, false);
	this.SupremeData.onreorder(previous.src());
	
	this.data.sort(SupremeSort(this.opts.orderKey));
    }
};
SupremeItem.prototype.down = function(c, swap) {
    c		= c === undefined ? this.depth : c;
    swap	= swap === false ? false : true;

    moveDown(this.item, this.opts.orderKey, c);

    for (var i in this.subNodes.Array) {
	var node	= this.subNodes(i);
	node.down(c, false);
    }

    if (swap) {
	this.SupremeData.onreorder(this.item);
	
	var next	= this.SupremeData(this.index+1);
	next.up(c, false);
	this.SupremeData.onreorder(next.src());
    
	this.data.sort(SupremeSort(this.opts.orderKey));
    }
};
SupremeItem.prototype.move = function(c,p) {
    c	= c || this.depth;
};
SupremeItem.prototype.isFirst = function(d) {
    return this.index === 0;
};
SupremeItem.prototype.isLast = function(d) {
    return this.index === this.data.length-1;
};
SupremeItem.prototype.del = function() {
    delete this.data[this.index];
    
    this.SupremeData.onreorder(this.item);
    this.data.sort(SupremeSort(this.opts.orderKey));
};

function moveUp(i,k,c) {return move(i,k,c,'-');}
function moveDown(i,k,c) {return move(i,k,c,'+');}
function move(item, key, column, direction) {
    var order	= splitOrder(item[key]);
    if (direction === '+')
	order[column]++;
    else if (direction === '-')
	order[column]--;
    else
	throw Error('Direction must be +/- not '+direction);
    item[key]	= order.join('.');
}
function splitOrder(order) {
    return order.split('.').map(function (s) {return parseInt(s);});
}
function SupremeSort(key) {
    return function(a, b) {
	var aOrder	= splitOrder(a[key]);
	var bOrder	= splitOrder(b[key]);
	var c	= 0;
	while (true) {
	    if ( aOrder[c] === bOrder[c] )
		c++
	    else
		return aOrder[c] < bOrder[c] ? -1 : 1;
	}
    }
}

module.exports = SupremeOrder;

