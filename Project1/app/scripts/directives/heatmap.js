angular.module('bowerVersionApp')
    .directive('heatmapChart', ['d3Service', 'ZoneChartService', function (d3Service, ZoneChartService) {
        return {
            restrict: 'EA',
            template: ' <svg width="100%" height="750" style="margin-top:100px" preserveAspectRatio="xMinYMin slice">',
            link: function (scope, element, attrs) {

                var zipcodeInput = '';

                function ParseXML(xml) {

                    var rateArray = [];
                    $(xml).find('Value').each(function () {
                        var zipValue = {};
                        var res = $(this).text().split(" ");
                        lineItem = res[0] + "," + res[1] + "," + res[2];
                        rateArray.push(lineItem);
                    });

                    return rateArray;
                };

                function CreateRateCSV(csv) {

                    var minZipValue = csv[0].split(",");
                    var rateArray = [];
                    for (var i = 0; i < csv.length; i++) {
                        lineItem = csv[i].split(",");
                        min = lineItem[0];
                        max = lineItem[1];
                        rate = lineItem[2];
                        for (var j = min; j <= max; j++) {
                            resultantLine = j + "," + rate + "\n";
                            rateArray.push(resultantLine);

                        }
                    }

                    return rateArray;

                };
                scope.setMaster = function (originZipCode) {
                    //$('#loadingimg').show();
                    if (originZipCode === undefined || originZipCode === '') {
                        originZipCode = "94306";

                    }

                    //Adobe Tracking
                    s.zip = originZipCode;
                    s.tl();
                    //
                    ZoneChartService.getZoneData(originZipCode)
                        .then(function (data) {
                            // promise fulfilled
                            if (data) {

                                var a = ParseXML(data);
                                var b = CreateRateCSV(a);
                                //  console.log(b)
                                var svg = d3.select("svg");

                                svg.remove();

                                draw(b, originZipCode);


                            } else {
                                console.log("else failed")
                            }
                        }, function (error) {
                            // promise rejected, could log the error with: console.log('error', error);
                            console.log("failed " + error)
                        });

                };

                function USDateFormat() {
                    var currentDate = new Date();
                    var month = currentDate.getUTCMonth() + 1; //months from 1-12
                    var day = currentDate.getUTCDate();
                    var year = currentDate.getUTCFullYear();

                    return month + "/" + day + "/" + year;
                }

                function Year() {
                    var currentDate = new Date();
                    var year = currentDate.getUTCFullYear();
                    return year;
                }

                function draw(zoneData, zip) {
                    d3Service.d3().then(function (d3) {

                        var zipRateArray = [];
                        zipRateArray = zoneData
                        var originZipCode = zip;

                        var w = window.innerWidth,
                            h = window.innerHeight;
                        w = w - 120;
                        h = h - 60; // this -60 is ro compensate for the margin-top css on the svg

                        var randomW = d3.random.normal(700, 700);
                        var randomH = d3.random.normal(413, 413);

                        // The true width of the drawn map at a scale of 1
                        var drawwidth = 2801,
                            drawheight = 1657;

                        var widthscale = w / drawwidth,
                            heightscale = h / drawheight;

                        var superscale = 1;
                        if (widthscale < heightscale) {
                            superscale = widthscale;
                        } else if (heightscale < widthscale) {
                            superscale = heightscale;
                        }

                        var xOff = 1870,
                            yOff = 100;

                        //scaling lat/lon onto x/y axis
                        //This is for setting darker state border lines
                        var projection = d3.geo.albersUsa().scale(3656).translate([3200 - xOff, 914 - yOff]);

                        var path = d3.geo.path().projection(projection);

                        var svg = d3.select("body").insert("svg:svg", "h2").attr("width", w).attr("height", h).attr("style", "margin-top:100px;");

                        var gtransform = svg.append("g").attr("id", "thetransform");

                        var states = gtransform.append("g").attr("id", "states");

                        var cells = gtransform.append("g").attr("id", "cells");

                        var transitionLocations = [];

                        //open config file
                        d3.json("/data/Marketing/Zonemap/heatmap_config.json", function (configuration) {

                            //get features and calculate linear coloring coefficient (color change / unit)
                            var min = parseInt(configuration.MinValue),
                                max = parseInt(configuration.MaxValue),
                                tieredColoring = false,
                                showZipLabels = false,
                                transitionOverZips = false,
                                startH, coeffH = 0,
                                startS, coeffS = 0,
                                startL, coeffL = 0;

                            if (parseInt(configuration.TierColorization) !== 0) {
                                tieredColoring = true;
                            } else {
                                startH = parseInt(configuration.hStart);
                                var endH = parseInt(configuration.hEnd);

                                if (startH !== endH) {
                                    coeffH = (endH - startH) / (max - min);
                                }

                                startS = parseInt(configuration.sStart);
                                var endS = parseInt(configuration.sEnd);

                                if (startS !== endS) {
                                    coeffS = (endS - startS) / (max - min);
                                }

                                startL = parseInt(configuration.lStart);
                                var endL = parseInt(configuration.lEnd);

                                if (startL !== endL) {
                                    coeffL = (endL - startL) / (max - min);
                                }
                            }

                            //show or not show labels
                            if (parseInt(configuration.showLabels) !== 0) {
                                showZipLabels = true;
                            }

                            //show or not show labels
                            if (parseInt(configuration.transitionOverZips) !== 0) {
                                transitionOverZips = true;
                            }

                            //open us outline file
                            d3.json("/data/Marketing/Zonemap/states_statebystate.json", function (collection) {

                                var pkgPerZip = new Array(100000);
                                for (var i = 500; i < 100000; i++) {
                                    pkgPerZip[i] = 8;
                                }

                                zoneData.forEach(function (line) {
                                    lineElements = line.split(",");
                                    zipCode = lineElements[0];
                                    rate = lineElements[1];
                                    pkgPerZip[parseInt(zipCode)] = parseInt(rate);
                                })


                                //open voronoi polygons file
                                d3.json("/data/Marketing/Zonemap/heatmapping_multizip_polygons.json", function (featureCollection) {
                                    var polygons = [],
                                        zips = [],
                                        colors = [],
                                        pkgPerVoronoi = [];

                                    //for each region find unit rate
                                    featureCollection.features.forEach(function (polygon) {
                                        polygons.push(polygon.geometry.coordinates[0])
                                        zips.push(polygon.zipcode);


                                        var rate = 0;

                                        polygon.zipcode.forEach(function (polygonZip) {
                                            rate = pkgPerZip[parseInt(polygonZip)];
                                        })
                                        if (rate > max) {
                                            rate = max;
                                        }
                                        if (rate < min) {
                                            rate = min;
                                        }
                                        pkgPerVoronoi.push(rate);
                                    })

                                    //calculate and associate color of the voronoi regions through a parallel array
                                    pkgPerVoronoi.forEach(function (region) {
                                        //tiered colorization algorithm
                                        if (tieredColoring) {
                                            var colorIndex = 0;
                                            for (var x = configuration.Key.length - 1; x >= 0; x--) {
                                                if (region > configuration.Key[x].value) {
                                                    colorIndex = x + 1;
                                                    break;
                                                }
                                            }

                                            colors.push(configuration.Key[colorIndex].cellColor);
                                        }
                                        //linear coloring algorithm
                                        else {
                                            var hVal = Math.round(startH + (coeffH * (region - min))),
                                                sVal = Math.round(startS + (coeffS * (region - min))),
                                                lVal = Math.round(startL + (coeffL * (region - min)));
                                            colors.push("hsl(" + hVal + "," + sVal + "%," + lVal + "%)");
                                        }
                                    })

                                    //calculate and associate colors of the map key
                                    configuration.Key.forEach(function (keyPoly) {
                                        polygons.push(keyPoly.geometry.coordinates[0]);
                                        if (tieredColoring) {
                                            colors.push(keyPoly.cellColor);
                                        } else {
                                            var hVal = Math.round(startH + (coeffH * (keyPoly.value - min))),
                                                sVal = Math.round(startS + (coeffS * (keyPoly.value - min))),
                                                lVal = Math.round(startL + (coeffL * (keyPoly.value - min)));
                                            colors.push("hsl(" + hVal + "," + sVal + "%," + lVal + "%)");
                                        }
                                    })

                                    //shift voronoi regions to allign with map
                                    polygons.forEach(function (poly) {
                                        poly.forEach(function (point) {
                                            point[0] -= xOff;
                                            point[1] -= yOff;
                                        })
                                    })

                                    states.selectAll("path").data(collection.features).enter().append("svg:path").attr("d", path);
                                    var g = cells.selectAll("g").data(polygons).enter().append("g")

                                    //add cells to panel
                                    g.append("svg:path").attr("class", "voronoiCell").attr("fill", function (fill, i) {
                                        return colors[i];
                                    }).attr("stroke", function (stroke, i) {
                                        return colors[i];
                                    }).attr("d", function (d, i) {
                                        return "M" + polygons[i].join("L") + "Z";
                                    })

                                    //add map key labels to panel
                                    for (var i = 0; i < configuration.Key.length; i++) {
                                        gtransform.append("text").attr("class", "mapkey").attr("x", parseInt(configuration.Key[i].geometry.coordinates[0][2][0])).attr("y", parseInt(configuration.Key[i].geometry.coordinates[0][2][1])).attr("dx", 10).attr("dy", -10).text(configuration.Key[i].Title);
                                    }
                                    //if specified, add zip labels to panel
                                    if (showZipLabels) {
                                        configuration.Labels.forEach(function (label) {
                                            //search for corresponding zip
                                            var k = 0,
                                                arrayIndex = -1,
                                                sumX = 0,
                                                sumY = 0,
                                                labelZip = parseInt(label.Zip);

                                            while (k < zips.length && arrayIndex === -1) {
                                                zips[k].forEach(function (subZip) {
                                                    if (labelZip == subZip) {
                                                        arrayIndex = k;
                                                    }
                                                })
                                                k++;
                                            }

                                            if (arrayIndex === -1) {
                                                console.log("Zip code not found:", label);
                                            } else {
                                                //find center
                                                polygons[arrayIndex].forEach(function (zipCoord) {
                                                    sumX += zipCoord[0];
                                                    sumY += zipCoord[1];
                                                })

                                                //draw label at center
                                                gtransform.append("text").attr("class", "ziplabel").attr("x", sumX / polygons[arrayIndex].length).attr("y", sumY / polygons[arrayIndex].length).text(label.Title);
                                            }
                                        })
                                    }

                                    //Compile a list for the transition zooming
                                    if (transitionOverZips) {
                                        //initialize the array that will be iterated over later for the looping transitions
                                        configuration.Transitions.forEach(function (transition) {
                                            //check if a reset has been placed in the list
                                            if (transition.Zip === "RESET") {
                                                var transitionLocation = {
                                                    "Zip": "RESET",
                                                    "TransitionDuration": parseInt(transition.TransitionDuration),
                                                    "WaitTime": parseInt(transition.WaitTime)
                                                }
                                                transitionLocations[transitionLocations.length] = transitionLocation;
                                            } else {
                                                //search for corresponding zip
                                                var k = 0,
                                                    arrayIndex = -1,
                                                    sumX = 0,
                                                    sumY = 0,
                                                    labelZip = parseInt(transition.Zip);

                                                while (k < zips.length && arrayIndex === -1) {
                                                    zips[k].forEach(function (subZip) {
                                                        if (labelZip == subZip) {
                                                            arrayIndex = k;
                                                        }
                                                    })
                                                    k++;
                                                }

                                                if (arrayIndex === -1) {
                                                    console.log("Zip code not found:", transition);
                                                } else {
                                                    //find center of the zipcode region
                                                    polygons[arrayIndex].forEach(function (zipCoord) {
                                                        sumX += zipCoord[0];
                                                        sumY += zipCoord[1];
                                                    })
                                                    console.log(transition.ZoomScale)
                                                    var transitionLocation = {
                                                        "Zip": labelZip,
                                                        "TransitionDuration": parseInt(transition.TransitionDuration),
                                                        "WaitTime": parseInt(transition.WaitTime),
                                                        "ZoomScale": parseInt(transition.ZoomScale),
                                                        "Xcord": sumX / polygons[arrayIndex].length,
                                                        "Ycord": sumY / polygons[arrayIndex].length
                                                    }

                                                    //add to the list
                                                    transitionLocations[transitionLocations.length] = transitionLocation;
                                                }
                                            }
                                        })
                                    }

                                })
                            })

                            //set the initial viewport
                            gtransform.attr("transform", "translate(" + [16, 0] + ")scale(" + .420 + ")");

                        });

                        var transitionLocationiterator = 0,
                            waittime = 1000,
                            transitionduration = 3750;

                        var usdateformat = USDateFormat();
                        var currentyear = Year();
                        var footer = document.getElementById("footer");
                        footer.innerHTML = "© " + currentyear + " Endicia, a Newell Rubbermaid brand. All rights reserved. Map generated on " + usdateformat + ", reflects USPS zones for packages shipped from " + originZipCode + " ZIP code.";


                        //  setTimeout(function(){
                        // $('#loadingimg').hide();
                        //}, 5000);
                    });

                };

            }
        };
    }]);