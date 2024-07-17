import * as d3 from "d3";
import * as topojson from "topojson"

let Colors = [
  {color: '#E0FFFF', text: '3'},
  {color: '#ADD8E6', text: '12'},
  {color: '#87CEFA', text: '21'},
  {color: '#318CE7', text: '30'},
  {color: '#0066b2', text: '39'},
  {color: '#00308F', text: '48'},
  {color: '#002D62', text: '57'},
  {color: 'rgba(0, 0, 0, 0)', text: '66%'}
];


let countiesURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;
let colorScale;

let canvas = d3.select("#canvas");
let legend = d3.select("#legend");
let tooltip = d3.select("#tooltip");

let makeColorScale = () => {
  colorScale = d3.scaleLinear()
  .domain([3, 66])
  .range([0, 300]);

  let colorAxis = d3.axisBottom(colorScale);

  legend.append('g')
  .call(colorAxis)
  .attr('id', 'colors')
  .attr('transform', 'translate(0, ' + 10 + ')');

  legend.selectAll('rect')
  .data(Colors)
  .enter()
  .append('rect')
  .attr('height', 10)
  .attr('width', 276 / 7 + 3)
  .attr('fill', d => d['color'])
  .attr('x', d => colorScale(d['text']));
};


let drawMap = () => {

canvas.selectAll('path') 
.data(countyData)
.enter()
.append('path')
.attr('d', d3.geoPath())
.attr('class', "county")
.attr('fill', d => {
  let id = d['id'];
  let county = educationData.find(d => d['fips'] === id);
  let percentage = county['bachelorsOrHigher'];
  return percentage <= 12 ? "#E0FFFF" : percentage <= 21 ? "#ADD8E6" : percentage <= 30 ? "#87CEFA" : percentage >= 39 ? "#318CE7" : percentage >= 48 ? "#0066b2" :  percentage >= 57 ? "#00308F": "#002D62"; 
})
.attr('data-fips', d => d['id'])
.attr('data-education', d => {
  let id = d['id'];
  let county = educationData.find(d => d['fips'] === id);
  let percentage = county['bachelorsOrHigher'];
  return percentage;
})
.on("mouseover", (event, d) => {
tooltip.transition()
.style("visibility", 'visible');
let id = d['id'];
let county = educationData.find(d => d['fips'] === id);
tooltip.html(county['area_name'] + ', ' + " " + county['state'] + ':' + " " + county['bachelorsOrHigher'] + '%')
.style('left', event.pageX + 8 + 'px')
.style('top', event.pageY - 30 + 'px')
.attr('data-education', county['bachelorsOrHigher'])
})
.on("mouseout", (event) => {
  tooltip.transition()
  .style('visibility', 'hidden')
})
};

d3.json(countiesURL).then(
  (data, error) => {
    if (error) {
      console.log(error)
    } else {
      countyData = topojson.feature(data, data.objects.counties).features;
      console.log(countyData)

      d3.json(educationURL).then(
        (data, error) => {
          if (error) {
            console.log(log)
          } else {
           educationData = data
           console.log(educationData)
           console.log(d3)
           drawMap()
           makeColorScale()
          }
        }
      )
    }
  }
);
