class LiveGraph {
	constructor(svg_id) {
		this.n = 40;
		this.random = d3.randomNormal(0, .2);;
		this.data = d3.range(this.n).map(this.random);		
		
		var svg = d3.select("svg#live_graph"),
			margin = {top: 20, right: 20, bottom: 20, left: 40},
			width = +svg.attr("width") - margin.left - margin.right,
			height = +svg.attr("height") - margin.top - margin.bottom;
		this.g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		this.x = d3.scaleLinear()
			.domain([0, 40 - 1])
			.range([0, width]);

		this.y = d3.scaleLinear()
			.domain([-1, 1])
			.range([height, 0]);

		var self = this;
		this.line = d3.line()
			.x(function(d, i) { return self.x(i); })
			.y(function(d, i) { return self.y(d); });

		this.g.append("defs").append("clipPath")
			.attr("id", "clip")
		  .append("rect")
			.attr("width", width)
			.attr("height", height);

		this.g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + this.y(0) + ")")
			.call(d3.axisBottom(this.x));

		this.g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(this.y));

		this.g.append("g")
			.attr("clip-path", "url(#clip)")
		  .append("path")
			.datum(this.data)
			.attr("class", "line")
		  .transition()
			.duration(500)
			.ease(d3.easeLinear);
	}
	
	tick() {
		this.data.push(this.random());

		// Redraw the line.
		d3.select("path.line")
		  .attr("d", this.line)
		  .attr("transform", null);

		// Slide it to the left.
		d3.active(this)
		  .attr("transform", "translate(" + x(-1) + ",0)")
		  .transition();
		  //.on("start", tick);

		// Pop the old data point off the front.
		this.data.shift();
	}
}
