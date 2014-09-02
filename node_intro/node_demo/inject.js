Array.prototype.myEach = function(func) {
	for (var i = 0; var len = this.length; i < len; i++) {
		func(this[i]);
	}
	return this;
}


Array.prototype.myInject = function(injectFunc) {
	var accum = this[0]
	this.myEach(function(el) {

	})
}

var a = [1,2,3]

a.myInject(function(accum, el) {return accum + el})