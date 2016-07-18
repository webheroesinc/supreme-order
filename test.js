
var SupremeOrder	= require('./index.js');

var data = {
    "2.0": {
	title: "Pre Procedure",
	ordering: "2.0",
	items: {
	    "2.2": {
		title: "Disclosure",
		ordering: "2.2"
	    },
	    "2.1": {
		title: "Procedure Prep",
		ordering: "2.1"
	    }
	}
    },
    "1.0": {
	title: "Introduction",
	ordering: "1.0",
	items: {
	    "1.2": {
		title: "Tools",
		ordering: "1.2"
	    },
	    "1.3": {
		title: "Cautions",
		ordering: "1.3"
	    },
	    "1.1": {
		title: "Overview",
		ordering: "1.1"
	    }
	}
    }
};

var SupremeData		= SupremeOrder(data, {
    "orderKey": 'ordering',
    "onreorder": function(item) {
	console.log('TRIGGERED REORDER');
	console.log(item);
    }
});

for (var i in SupremeData.Array) {
    console.log('---------');
    var item	= SupremeData.get(i);
    var node	= SupremeData(i);
    console.log( item.ordering, node.isFirst(), node.isLast(), node.src().title, item.title );
    
    var subSupremeData	= node.children();
    for (var i in subSupremeData.Array) {
	var item	= subSupremeData.get(i);
	var node	= subSupremeData(i);
	console.log( '- '+item.ordering, node.isFirst(), node.isLast(), node.src().title, item.title );
    }    
}
console.log();
console.log('=========');
SupremeData(0).children()(2).up();
SupremeData(1).children()(0).down();

console.log();
for (var i in SupremeData.Array) {
    console.log('---------');
    var item	= SupremeData.get(i);
    var node	= SupremeData(i);
    console.log( item.ordering, node.isFirst(), node.isLast(), node.src().title, item.title );
    
    var subSupremeData	= node.children();
    for (var i in subSupremeData.Array) {
	var item	= subSupremeData.get(i);
	var node	= subSupremeData(i);
	console.log( '- '+item.ordering, node.isFirst(), node.isLast(), node.src().title, item.title );
    }    
}
console.log();
SupremeData(1).up();
console.log();
for (var i in SupremeData.Array) {
    console.log('---------');
    var item	= SupremeData.get(i);
    var node	= SupremeData(i);
    console.log( item.ordering, node.isFirst(), node.isLast(), node.src().title, item.title );
    
    var subSupremeData	= node.children();
    for (var i in subSupremeData.Array) {
	var item	= subSupremeData.get(i);
	var node	= subSupremeData(i);
	console.log( '- '+item.ordering, node.isFirst(), node.isLast(), node.src().title, item.title );
    }    
}

// var SupremeData		= SupremeList(data);
// for (var i in SupremeData.Array) {
//     SupremeData(i).up(c)
// }
